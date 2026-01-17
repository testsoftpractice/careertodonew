/**
 * Advanced Task Management
 * Features: dependencies, priorities, time tracking, and automatic blocking
 */

export enum TaskPriority {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export enum TaskStatus {
  BACKLOG = 'BACKLOG',
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  DONE = 'DONE',
  BLOCKED = 'BLOCKED',
  CANCELLED = 'CANCELLED',
}

export interface AdvancedTask {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  
  // Task management fields
  status: TaskStatus;
  priority: TaskPriority;
  estimatedHours?: number;
  actualHours?: number;
  dueDate?: Date;
  completedAt?: Date;
  
  // Dependencies
  dependsOn: string[];  // Task IDs this depends on
  blocks: string[];      // Task IDs blocked by this task
  
  // Assignments
  assignedTo: string;   // User ID
  assignedBy: string;   // User ID who assigned
  
  // Tracking
  createdAt: Date;
  updatedAt: Date;
  startedAt?: Date;
  
  // Metadata
  labels: string[];     // e.g., "frontend", "urgent", "bug"
  tags: string[];      // e.g., "backend", "api", "documentation"
  attachments: string[]; // File URLs
  checklist: {
    id: string;
    item: string;
    completed: boolean;
    completedBy?: string;
    completedAt?: Date;
  }[];
  
  // Relations
  subtasks: AdvancedTask[];
  parentTaskId?: string;
  milestoneId?: string;
}

/**
 * Task dependency graph
 * Used for visualizing and managing task relationships
 */
export interface TaskDependency {
  taskId: string;
  dependsOnId: string;
  dependencyType: 'MUST_COMPLETE' | 'MUST_START' | 'SHOULD_COMPLETE';
  notes?: string;
}

/**
 * Work Breakdown Structure (WBS)
 * Hierarchical task organization
 */
export interface WorkBreakdownStructure {
  id: string;
  projectId: string;
  name: string;
  type: 'PHASE' | 'DELIVERABLE' | 'MILESTONE' | 'TASK_GROUP';
  parentId?: string;  // For nesting
  order: number;
  estimatedDuration?: number;
  actualDuration?: number;
  progress: number;  // 0-100
  status: TaskStatus;
}

/**
 * Time tracking entry
 */
export interface TimeEntry {
  id: string;
  taskId: string;
  userId: string;
  date: Date;
  hours: number;
  description?: string;
  billable?: boolean;
  hourlyRate?: number;
}

/**
 * Task priority matrix helper
 * Eisenhower matrix: Important vs Urgent
 */
export type EisenhowerQuadrant =
  | 'DO_FIRST'      // Important & Urgent
  | 'SCHEDULE'        // Important & Not Urgent
  | 'DELEGATE'        // Not Important & Urgent
  | 'DELETE'          // Not Important & Not Urgent;

export function getEisenhowerQuadrant(priority: TaskPriority, dueDate?: Date): EisenhowerQuadrant {
  const isUrgent = dueDate ? new Date() > new Date(dueDate.getTime() - 2 * 24 * 60 * 60 * 1000) : false;
  const isImportant = priority === TaskPriority.CRITICAL || priority === TaskPriority.HIGH;
  
  if (isUrgent && isImportant) return 'DO_FIRST';
  if (isUrgent && !isImportant) return 'DELEGATE';
  if (!isUrgent && isImportant) return 'SCHEDULE';
  return 'DELETE';
}

/**
 * Task completion validator
 * Check if all subtasks, dependencies, and checklist items are done
 */
export function isTaskComplete(task: AdvancedTask): boolean {
  if (task.status !== TaskStatus.DONE) return false;
  
  // Check dependencies
  if (task.dependsOn.length > 0) return false; // Should be handled by dependency system
  
  // Check if task blocks anything
  if (task.blocks.length > 0) return false;
  
  // Check subtasks
  if (task.subtasks.some(sub => sub.status !== TaskStatus.DONE)) return false;
  
  // Check checklist
  if (task.checklist.some(item => !item.completed)) return false;
  
  return true;
}

/**
 * Task conflict detector
 * Find circular dependencies or resource conflicts
 */
export interface TaskConflict {
  type: 'CIRCULAR_DEPENDENCY' | 'RESOURCE_CONFLICT' | 'TIME_CONFLICT' | 'DUPLICATE_TASK';
  taskId: string;
  description: string;
  severity: 'ERROR' | 'WARNING' | 'INFO';
}

export function detectTaskConflicts(tasks: AdvancedTask[]): TaskConflict[] {
  const conflicts: TaskConflict[] = [];
  
  // Check for circular dependencies
  const taskMap = new Map(tasks.map(t => [t.id, t]));
  const visited = new Set<string>();
  
  tasks.forEach(task => {
    const checkCircular = (taskId: string) => {
      if (visited.has(taskId)) {
        conflicts.push({
          type: 'CIRCULAR_DEPENDENCY',
          taskId: task.id,
          description: `Circular dependency detected in task "${task.title}"`,
          severity: 'ERROR',
        });
        return true;
      }
      visited.add(taskId);
      
      return task.dependsOn.some(depId => checkCircular(depId));
    };
    
    if (task.dependsOn.length > 0) {
      checkCircular(task.id);
    }
  });
  
  return conflicts;
}

/**
 * Task effort estimation
 * Used for project planning and resource allocation
 */
export interface TaskEstimation {
  taskId: string;
  type: 'OPTIMISTIC' | 'REALISTIC' | 'PESSIMISTIC';
  hours: number;
  confidence: number; // 0-100
  notes?: string;
  estimatedBy?: string; // User ID who estimated
  estimatedAt: Date;
}

export function getTaskEstimations(task: AdvancedTask): {
  optimistic: number;
  realistic: number;
  pessimistic: number;
} {
  if (!task.estimatedHours) {
    return { optimistic: 0, realistic: 0, pessimistic: 0 };
  }
  
  const base = task.estimatedHours;
  return {
    optimistic: Math.round(base * 0.8),
    realistic: base,
    pessimistic: Math.round(base * 1.2),
  };
}
