import { NextRequest } from 'next/server'
import { db } from './db'
import { UAParser } from 'ua-parser-js'

export interface GeolocationData {
  country?: string
  region?: string
  city?: string
  latitude?: number
  longitude?: number
  timezone?: string
  isp?: string
  asn?: string
  isProxy?: boolean
  isVpn?: boolean
  isTor?: boolean
  isDatacenter?: boolean
  threatLevel?: string
}

export interface DeviceInfo {
  deviceType?: string
  os?: string
  browser?: string
}

export interface IPTrackingData {
  userId: string
  ipAddress: string
  port?: number
  userAgent?: string
  action?: string
  status?: string
  failureReason?: string
  geolocation?: GeolocationData
  deviceInfo?: DeviceInfo
}

/**
 * Extract IP address from NextRequest
 * Handles various headers and proxy scenarios
 */
export function extractIPAddress(request: NextRequest): string {
  // Try to get IP from various headers
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfConnectingIP = request.headers.get('cf-connecting-ip')
  const xClientIP = request.headers.get('x-client-ip')

  let ip = forwarded || realIP || cfConnectingIP || xClientIP || ''

  // Handle multiple IPs in x-forwarded-for (take the first one)
  if (forwarded) {
    const ips = forwarded.split(',').map(ip => ip.trim())
    ip = ips[0]
  }

  // Fallback to a default IP if no IP found
  if (!ip || ip === '' || ip === 'unknown') {
    ip = '127.0.0.1'
  }

  // Validate IPv6 address and remove port if present
  if (ip.includes(':') && ip.includes('.')) {
    // IPv6 with IPv4 mapped
    const parts = ip.split(':')
    const ipv4Part = parts.find(p => p.includes('.'))
    if (ipv4Part) {
      ip = ipv4Part
    }
  } else if (ip.includes('[')) {
    // IPv6 with brackets
    ip = ip.match(/\[([^\]]+)\]/)?.[1] || ip
  } else if (ip.includes(':') && !ip.includes('.')) {
    // Pure IPv6
    // Keep as is for now, but you might want to handle this differently
  } else {
    // IPv4, remove port if present
    ip = ip.split(':')[0]
  }

  return ip
}

/**
 * Get geolocation data from IP address using a free API
 */
export async function getGeolocationData(ip: string): Promise<GeolocationData> {
  // Don't look up localhost or private IPs
  if (ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.16.')) {
    return {
      country: 'Local',
      region: 'Local',
      city: 'Localhost',
      threatLevel: 'LOW',
    }
  }

  try {
    // Using ip-api.com (free, no API key required for non-commercial use)
    // Note: For production, you should use a paid service with better reliability
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

    const response = await fetch(`http://ip-api.com/json/${ip}`, {
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      return { threatLevel: 'UNKNOWN' }
    }

    const data = await response.json()

    if (data.status === 'fail') {
      return { threatLevel: 'UNKNOWN' }
    }

    return {
      country: data.country,
      region: data.regionName,
      city: data.city,
      latitude: data.lat,
      longitude: data.lon,
      timezone: data.timezone,
      isp: data.isp,
      asn: data.as,
      isProxy: data.proxy || false,
      isVpn: false, // ip-api doesn't provide this
      isTor: data.hosting || false,
      isDatacenter: data.hosting || false,
      threatLevel: data.proxy || data.hosting ? 'MEDIUM' : 'LOW',
    }
  } catch (error) {
    console.error('Error fetching geolocation:', error)
    return { threatLevel: 'UNKNOWN' }
  }
}

/**
 * Parse user agent string to get device information
 */
export function parseUserAgent(userAgent?: string): DeviceInfo {
  if (!userAgent) {
    return {}
  }

  try {
    const parser = new UAParser(userAgent)
    const result = parser.getResult()

    return {
      deviceType: result.device.type || 'desktop',
      os: `${result.os.name} ${result.os.version || ''}`.trim(),
      browser: `${result.browser.name} ${result.browser.version || ''}`.trim(),
    }
  } catch (error) {
    console.error('Error parsing user agent:', error)
    return {}
  }
}

/**
 * Record IP tracking information
 */
export async function recordIPTracking(data: IPTrackingData) {
  try {
    const userAgent = data.userAgent || ''
    const deviceInfo = data.deviceInfo || parseUserAgent(userAgent)
    const geolocation = data.geolocation || {}

    // Check if this IP has been used before by this user
    const existingTracking = await db.iPTracking.findFirst({
      where: {
        userId: data.userId,
        ipAddress: data.ipAddress,
        status: 'SUCCESS',
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const loginCount = existingTracking ? existingTracking.loginCount + 1 : 1

    // Create IP tracking record
    await db.iPTracking.create({
      data: {
        userId: data.userId,
        ipAddress: data.ipAddress,
        port: data.port,
        userAgent: userAgent,
        action: data.action || 'LOGIN',
        status: data.status || 'SUCCESS',
        failureReason: data.failureReason,
        country: geolocation.country,
        region: geolocation.region,
        city: geolocation.city,
        latitude: geolocation.latitude,
        longitude: geolocation.longitude,
        timezone: geolocation.timezone,
        isp: geolocation.isp,
        asn: geolocation.asn,
        deviceType: deviceInfo.deviceType,
        os: deviceInfo.os,
        browser: deviceInfo.browser,
        loginCount: loginCount,
        isProxy: geolocation.isProxy || false,
        isVpn: geolocation.isVpn || false,
        isTor: geolocation.isTor || false,
        isDatacenter: geolocation.isDatacenter || false,
        threatLevel: geolocation.threatLevel || 'LOW',
        metadata: JSON.stringify({
          ...geolocation,
          deviceInfo,
          timestamp: new Date().toISOString(),
        }),
      },
    })

    return { success: true }
  } catch (error) {
    console.error('Error recording IP tracking:', error)
    return { success: false, error: String(error) }
  }
}

/**
 * Get unique IP addresses for a user with their geolocation data
 */
export async function getUserUniqueIPs(userId: string) {
  try {
    const ipRecords = await db.iPTracking.groupBy({
      by: ['ipAddress', 'country', 'region', 'city', 'latitude', 'longitude', 'timezone', 'isp'],
      where: {
        userId,
        status: 'SUCCESS',
      },
      _count: {
        ipAddress: true,
      },
      _max: {
        createdAt: true,
      },
      orderBy: {
        _max: {
          createdAt: 'desc',
        },
      },
    })

    return ipRecords.map(record => ({
      ipAddress: record.ipAddress,
      country: record.country,
      region: record.region,
      city: record.city,
      latitude: record.latitude,
      longitude: record.longitude,
      timezone: record.timezone,
      isp: record.isp,
      loginCount: record._count.ipAddress,
      lastSeen: record._max.createdAt,
    }))
  } catch (error) {
    console.error('Error getting user unique IPs:', error)
    return []
  }
}

/**
 * Get IP history for a user
 */
export async function getUserIPHistory(
  userId: string,
  options: {
    limit?: number
    offset?: number
    ipAddress?: string
    action?: string
    status?: string
  } = {}
) {
  try {
    const { limit = 50, offset = 0, ipAddress, action, status } = options

    const where: any = {
      userId,
    }

    if (ipAddress) {
      where.ipAddress = ipAddress
    }

    if (action) {
      where.action = action
    }

    if (status) {
      where.status = status
    }

    const [records, totalCount] = await Promise.all([
      db.iPTracking.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
        skip: offset,
      }),
      db.iPTracking.count({ where }),
    ])

    return {
      records,
      totalCount,
      hasMore: offset + records.length < totalCount,
    }
  } catch (error) {
    console.error('Error getting user IP history:', error)
    return {
      records: [],
      totalCount: 0,
      hasMore: false,
    }
  }
}

/**
 * Get IP statistics for a user
 */
export async function getUserIPStats(userId: string) {
  try {
    const [
      totalLogins,
      uniqueIPs,
      uniqueCountries,
      uniqueCities,
      mostRecentLogin,
      mostUsedIP,
    ] = await Promise.all([
      db.iPTracking.count({
        where: {
          userId,
          action: 'LOGIN',
          status: 'SUCCESS',
        },
      }),
      db.iPTracking.groupBy({
        by: ['ipAddress'],
        where: {
          userId,
          status: 'SUCCESS',
        },
      }).then(groups => groups.length),
      db.iPTracking.groupBy({
        by: ['country'],
        where: {
          userId,
          status: 'SUCCESS',
          country: {
            not: null,
          },
        },
      }).then(groups => groups.length),
      db.iPTracking.groupBy({
        by: ['city'],
        where: {
          userId,
          status: 'SUCCESS',
          city: {
            not: null,
          },
        },
      }).then(groups => groups.length),
      db.iPTracking.findFirst({
        where: {
          userId,
          action: 'LOGIN',
          status: 'SUCCESS',
        },
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          ipAddress: true,
          city: true,
          country: true,
          createdAt: true,
        },
      }),
      db.iPTracking.groupBy({
        by: ['ipAddress', 'city', 'country'],
        where: {
          userId,
          status: 'SUCCESS',
        },
        _sum: {
          loginCount: true,
        },
        orderBy: {
          _sum: {
            loginCount: 'desc',
          },
        },
        take: 1,
      }).then(results => results[0]),
    ])

    return {
      totalLogins,
      uniqueIPs,
      uniqueCountries,
      uniqueCities,
      mostRecentLogin,
      mostUsedIP: mostUsedIP
        ? {
            ipAddress: mostUsedIP.ipAddress,
            city: mostUsedIP.city,
            country: mostUsedIP.country,
            loginCount: mostUsedIP._sum.loginCount || 0,
          }
        : null,
    }
  } catch (error) {
    console.error('Error getting user IP stats:', error)
    return null
  }
}
