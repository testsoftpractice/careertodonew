#!/usr/bin/env node

/**
 * Comprehensive API Testing Script
 * Tests all endpoints from all user perspectives
 */

const BASE_URL = 'http://localhost:3000/api';

// Test credentials
const CREDENTIALS = {
  student: { email: 'student.stanford@edu.com', password: 'Password123!' },
  employer: { email: 'employer@techcorp.com', password: 'Password123!' },
  investor: { email: 'investor@venturefund.com', password: 'Password123!' },
  universityAdmin: { email: 'admin.stanford@stanford.edu', password: 'Password123!' },
  platformAdmin: { email: 'admin@careertodo.com', password: 'Password123!' }
};

let authTokens = {};
let testResults = [];

function log(message, type = 'info') {
  const colors = {
    info: '\x1b[36m', // cyan
    success: '\x1b[32m', // green
    error: '\x1b[31m', // red
    warning: '\x1b[33m', // yellow
    reset: '\x1b[0m'
  };
  console.log(`${colors[type]}${message}${colors.reset}`);
}

function recordTest(name, passed, details = '') {
  testResults.push({ name, passed, details });
  if (passed) {
    log(`✅ ${name}`, 'success');
  } else {
    log(`❌ ${name}`, 'error');
    if (details) {
      log(`   Details: ${details}`, 'warning');
    }
  }
}

async function apiRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    const data = await response.json();
    return { status: response.status, data, ok: response.ok };
  } catch (error) {
    return { status: 0, data: { error: error.message }, ok: false };
  }
}

async function login(role) {
  const creds = CREDENTIALS[role];
  log(`\n🔐 Testing login for ${role}...`);

  const result = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(creds)
  });

  if (result.ok && result.data.token) {
    authTokens[role] = result.data.token;
    recordTest(`${role} Login`, true, `Token received`);
    return result.data.token;
  } else {
    recordTest(`${role} Login`, false, result.data.error || 'Unknown error');
    return null;
  }
}

async function testAuthEndpoints() {
  log('\n🧪 TESTING AUTHENTICATION ENDPOINTS', 'info');
  log('=' .repeat(60));

  // Test all user logins
  await login('student');
  await login('employer');
  await login('investor');
  await login('universityAdmin');
  await login('platformAdmin');

  // Test signup
  const signupResult = await apiRequest('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({
      email: 'testuser@example.com',
      password: 'Password123!',
      name: 'Test User',
      role: 'STUDENT'
    })
  });
  recordTest('User Signup', signupResult.ok || signupResult.data.error?.includes('already exists'),
    signupResult.data.error || 'Success');
}

async function testProjectEndpoints() {
  log('\n🧪 TESTING PROJECT ENDPOINTS', 'info');
  log('=' .repeat(60));

  const token = authTokens.employer;
  if (!token) {
    log('Skipping project tests - no auth token', 'warning');
    return;
  }

  // List projects
  const listResult = await apiRequest('/projects', {
    headers: { Authorization: `Bearer ${token}` }
  });
  recordTest('List Projects', listResult.ok);

  // Create project
  const createResult = await apiRequest('/projects', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      name: 'Test Project from API Test',
      description: 'This is a test project created via API',
      category: 'Testing',
      budget: 50000
    })
  });
  recordTest('Create Project', createResult.ok);

  let projectId = null;
  if (createResult.ok && createResult.data.id) {
    projectId = createResult.data.id;

    // Add project member
    const memberResult = await apiRequest(`/projects/${projectId}/members`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        userId: testResults.find(r => r.name.includes('Login')).userId, // Placeholder
        role: 'TEAM_MEMBER'
      })
    });
    recordTest('Add Project Member', memberResult.ok);
  }

  // Create task
  if (projectId) {
    const taskResult = await apiRequest('/tasks', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        projectId,
        title: 'Test Task from API',
        description: 'This is a test task',
        priority: 'HIGH',
        status: 'TODO'
      })
    });
    recordTest('Create Task', taskResult.ok);

    if (taskResult.ok && taskResult.data.id) {
      // Submit task
      const submitResult = await apiRequest(`/tasks/${taskResult.data.id}/submit`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          notes: 'Task completed successfully'
        })
      });
      recordTest('Submit Task', submitResult.ok);
    }
  }
}

async function testJobEndpoints() {
  log('\n🧪 TESTING JOB ENDPOINTS', 'info');
  log('=' .repeat(60));

  const employerToken = authTokens.employer;
  const studentToken = authTokens.student;

  if (!employerToken || !studentToken) {
    log('Skipping job tests - no auth tokens', 'warning');
    return;
  }

  // List jobs
  const listResult = await apiRequest('/jobs', {
    headers: { Authorization: `Bearer ${employerToken}` }
  });
  recordTest('List Jobs', listResult.ok);

  // Create job posting
  const createJobResult = await apiRequest('/jobs', {
    method: 'POST',
    headers: { Authorization: `Bearer ${employerToken}` },
    body: JSON.stringify({
      title: 'Software Engineer - API Test',
      description: 'Test job posting from comprehensive API testing',
      type: 'FULL_TIME',
      location: 'Remote',
      salary: {
        min: 80000,
        max: 120000
      }
    })
  });
  recordTest('Create Job Posting', createJobResult.ok);

  let jobId = null;
  if (createJobResult.ok && createJobResult.data.id) {
    jobId = createJobResult.data.id;

    // Apply for job
    const applyResult = await apiRequest(`/jobs/${jobId}/apply`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${studentToken}` },
      body: JSON.stringify({
        coverLetter: 'I am very interested in this position'
      })
    });
    recordTest('Apply for Job', applyResult.ok);
  }
}

async function testLeaveRequestEndpoints() {
  log('\n🧪 TESTING LEAVE REQUEST ENDPOINTS', 'info');
  log('=' .repeat(60));

  const studentToken = authTokens.student;
  const employerToken = authTokens.employer;

  if (!studentToken) {
    log('Skipping leave request tests - no auth token', 'warning');
    return;
  }

  // Create leave request
  const createLeaveResult = await apiRequest('/leave-requests', {
    method: 'POST',
    headers: { Authorization: `Bearer ${studentToken}` },
    body: JSON.stringify({
      leaveType: 'SICK_LEAVE',
      startDate: new Date(Date.now() + 86400000).toISOString(),
      endDate: new Date(Date.now() + 172800000).toISOString(),
      reason: 'Feeling unwell'
    })
  });
  recordTest('Create Leave Request', createLeaveResult.ok);

  let requestId = null;
  if (createLeaveResult.ok && createLeaveResult.data.id) {
    requestId = createLeaveResult.data.id;

    // Approve leave request (if we have an employer/admin token)
    if (employerToken) {
      const approveResult = await apiRequest(`/leave-requests/${requestId}/approve`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${employerToken}` },
        body: JSON.stringify({
          reason: 'Approved'
        })
      });
      recordTest('Approve Leave Request', approveResult.ok || approveResult.data.error?.includes('not authorized'));
    }
  }
}

async function testInvestmentEndpoints() {
  log('\n🧪 TESTING INVESTMENT ENDPOINTS', 'info');
  log('=' .repeat(60));

  const investorToken = authTokens.investor;
  const employerToken = authTokens.employer;

  if (!investorToken) {
    log('Skipping investment tests - no auth token', 'warning');
    return;
  }

  // List projects for investment
  const projectsResult = await apiRequest('/marketplace/projects', {
    headers: { Authorization: `Bearer ${investorToken}` }
  });
  recordTest('List Investment Projects', projectsResult.ok);

  // Create investment interest
  if (projectsResult.ok && projectsResult.data.length > 0) {
    const projectId = projectsResult.data[0].id;
    const interestResult = await apiRequest('/investments/interest', {
      method: 'POST',
      headers: { Authorization: `Bearer ${investorToken}` },
      body: JSON.stringify({
        projectId,
        amount: 100000,
        message: 'Interested in investing'
      })
    });
    recordTest('Submit Investment Interest', interestResult.ok);
  }

  // Create investment proposal
  const proposalResult = await apiRequest('/investments/proposals', {
    method: 'POST',
    headers: { Authorization: `Bearer ${investorToken}` },
    body: JSON.stringify({
      projectId: projectsResult.data?.[0]?.id,
      amount: 500000,
      equity: 10,
      message: 'Term sheet proposal'
    })
  });
  recordTest('Create Investment Proposal', proposalResult.ok);
}

async function testDashboardEndpoints() {
  log('\n🧪 TESTING DASHBOARD ENDPOINTS', 'info');
  log('=' .repeat(60));

  const studentToken = authTokens.student;
  const employerToken = authTokens.employer;
  const adminToken = authTokens.platformAdmin;

  // Student dashboard
  if (studentToken) {
    const studentStats = await apiRequest('/dashboard/student/stats', {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    recordTest('Student Dashboard Stats', studentStats.ok);
  }

  // Employer dashboard
  if (employerToken) {
    const employerStats = await apiRequest('/dashboard/employer/stats', {
      headers: { Authorization: `Bearer ${employerToken}` }
    });
    recordTest('Employer Dashboard Stats', employerStats.ok);
  }

  // Admin dashboard
  if (adminToken) {
    const adminStats = await apiRequest('/dashboard/admin/stats', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    recordTest('Platform Admin Dashboard Stats', adminStats.ok);
  }
}

async function printSummary() {
  log('\n📊 TEST SUMMARY', 'info');
  log('=' .repeat(60));

  const passed = testResults.filter(r => r.passed).length;
  const failed = testResults.filter(r => !r.passed).length;
  const total = testResults.length;
  const successRate = ((passed / total) * 100).toFixed(2);

  log(`\nTotal Tests: ${total}`, 'info');
  log(`Passed: ${passed}`, 'success');
  log(`Failed: ${failed}`, failed > 0 ? 'error' : 'success');
  log(`Success Rate: ${successRate}%`, successRate === '100.00' ? 'success' : 'warning');

  if (failed > 0) {
    log('\n❌ Failed Tests:', 'error');
    testResults.filter(r => !r.passed).forEach(test => {
      log(`   - ${test.name}`, 'error');
      if (test.details) {
        log(`     ${test.details}`, 'warning');
      }
    });
  }

  if (successRate === '100.00') {
    log('\n🎉 ALL TESTS PASSED! All endpoints are working correctly!', 'success');
  }
}

async function runAllTests() {
  log('🚀 Starting Comprehensive API Testing', 'info');
  log('=' .repeat(60));

  try {
    await testAuthEndpoints();
    await testProjectEndpoints();
    await testJobEndpoints();
    await testLeaveRequestEndpoints();
    await testInvestmentEndpoints();
    await testDashboardEndpoints();
    await printSummary();
  } catch (error) {
    log(`\n💥 Fatal Error: ${error.message}`, 'error');
    console.error(error);
  }
}

// Run tests
runAllTests().then(() => {
  process.exit(testResults.some(r => !r.passed) ? 1 : 0);
});
