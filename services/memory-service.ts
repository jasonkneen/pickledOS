/**
 * Memory Service - LEANN Integration
 * Provides semantic search for memory relationships
 */

const API_BASE = import.meta.env.VITE_MEMORY_API_URL || 'http://localhost:8000'

export interface MemorySearchResult {
  related_ids: string[]
  scores: number[]
}

export interface MemoryAddRequest {
  id: string
  text: string
  title?: string
  tags?: string[]
}

export interface BulkMemoryRequest {
  memories: MemoryAddRequest[]
}

class MemoryServiceError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message)
    this.name = 'MemoryServiceError'
  }
}

/**
 * Add a single memory to the semantic index
 */
export async function addMemory(memory: MemoryAddRequest): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/memory/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(memory)
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Unknown error' }))
      throw new MemoryServiceError(error.detail || 'Failed to add memory', response.status)
    }
  } catch (err) {
    if (err instanceof MemoryServiceError) throw err
    throw new MemoryServiceError('Network error connecting to memory service')
  }
}

/**
 * Add multiple memories at once (more efficient than individual adds)
 */
export async function bulkAddMemories(memories: MemoryAddRequest[]): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/memory/bulk-add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memories })
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Unknown error' }))
      throw new MemoryServiceError(error.detail || 'Failed to bulk add memories', response.status)
    }
  } catch (err) {
    if (err instanceof MemoryServiceError) throw err
    throw new MemoryServiceError('Network error connecting to memory service')
  }
}

/**
 * Find memories semantically similar to the given memory
 */
export async function findRelatedMemories(
  memoryId: string,
  k: number = 5
): Promise<MemorySearchResult> {
  try {
    const response = await fetch(`${API_BASE}/memory/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memory_id: memoryId, k })
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Unknown error' }))
      throw new MemoryServiceError(error.detail || 'Failed to search memories', response.status)
    }

    return await response.json()
  } catch (err) {
    if (err instanceof MemoryServiceError) throw err
    throw new MemoryServiceError('Network error connecting to memory service')
  }
}

/**
 * Clear all memories from the index
 */
export async function clearAllMemories(): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/memory/clear`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      throw new MemoryServiceError('Failed to clear memories', response.status)
    }
  } catch (err) {
    if (err instanceof MemoryServiceError) throw err
    throw new MemoryServiceError('Network error connecting to memory service')
  }
}

/**
 * Check if the memory service is available with LEANN support
 */
export async function checkServiceHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/`, {
      method: 'GET',
      signal: AbortSignal.timeout(2000) // 2s timeout
    })

    if (!response.ok) return false

    const data = await response.json()
    // Return true only if LEANN is available
    return data.leann_available === true
  } catch {
    return false
  }
}
