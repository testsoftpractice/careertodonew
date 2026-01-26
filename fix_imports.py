#!/usr/bin/env python3
import re

# Read project page
with open('/home/z/my-project/src/app/projects/[id]/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add ProfessionalKanbanBoard imports
old_imports = r"""import {
  DndContext,\n  closestCenter,\n  DragOverlay,\n  DragEndEvent,\n  PointerSensor,\n  useSensor,\n  useSensors,\n  DragStartEvent,\n} from '@dnd-kit/core'"""

new_imports = """import {
  DndContext,
  closestCenter,
  DragOverlay,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
} from '@dnd-kit/core'
import { motion, AnimatePresence } from 'framer-motion'
import ProfessionalKanbanBoard, { Task as KanbanTask } from '@/components/task/ProfessionalKanbanBoard'
"""

# Replace old imports
content = content.replace(old_imports, new_imports)

# Add imports for motion and ProfessionalKanbanBoard after lucide-react imports
lucide_import_pattern = r"(from 'lucide-react')"
match = re.search(lucide_import_pattern)
if match:
    # Check if motion and ProfessionalKanbanBoard already imported
    if 'motion' not in content:
        insert_pos = match.end() + 2
        content = content[:insert_pos] + "\nimport { motion, AnimatePresence } from 'framer-motion'\n" + content[insert_pos:]
    if 'ProfessionalKanbanBoard' not in content:
        insert_pos = match.end() + 4
        content = content[:insert_pos] + "\nimport ProfessionalKanbanBoard, { Task as KanbanTask } from '@/components/task/ProfessionalKanbanBoard'\n" + content[insert_pos:]

print("✓ Imports updated successfully")
else:
    print("⚠ Could not find lucide-react imports")
