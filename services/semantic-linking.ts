/**
 * LEANN Integration for Memory System
 */

import { Memory } from '../types'
import { bulkAddMemories, findRelatedMemories, checkServiceHealth } from './memory-service'
import { DATASETS } from '../constants'

export async function generateMemoriesWithEmbeddings(
  datasetId: string = 'pickles'
): Promise<Memory[]> {
  const dataset = DATASETS[datasetId] || DATASETS['pickles']
  const sources = ['wiki', 'book', 'article', 'lecture'] as const

  let categories = ['Fact']
  if (datasetId === 'pickles') categories = ['History', 'Science', 'Culinary']
  if (datasetId === 'space') categories = ['Astronomy', 'Physics', 'Cosmos']
  if (datasetId === 'coffee') categories = ['History', 'Culture', 'Botany']

  const memories: Memory[] = dataset.map((fact, i) => {
    const source = sources[i % sources.length]
    const category = categories[i % categories.length]
    const seed = datasetId + '-' + i + '-' + new Date().getTime()

    return {
      id: datasetId + '-' + i,
      title: fact.title,
      source: source,
      sourceId: datasetId,
      date: new Date(new Date().getTime() - Math.floor(Math.random() * 5000000000)).toLocaleDateString(),
      previewImage: 'https://picsum.photos/seed/' + seed + '/300/300',
      content: fact.content,
      tags: [category, datasetId.charAt(0).toUpperCase() + datasetId.slice(1)],
      relatedIds: []
    }
  })

  const isServiceAvailable = await checkServiceHealth()

  if (!isServiceAvailable) {
    console.warn('🔴 LEANN UNAVAILABLE - Using mock tag-based linking')
    console.warn('   To enable semantic search: cd backend/LEANN && uv tool install leann-core --with leann')
    return fallbackLinking(memories)
  }

  console.log('🟢 LEANN ACTIVE - Using semantic embeddings for relationships')

  try {
    console.log(`📤 Sending ${memories.length} memories to LEANN...`)

    await bulkAddMemories(
      memories.map(m => ({
        id: m.id,
        text: m.title + '. ' + m.content,
        title: m.title,
        tags: m.tags
      }))
    )

    console.log('✅ Memories indexed in LEANN')
    console.log('🔍 Computing semantic relationships...')

    const memoriesWithLinks = await Promise.all(
      memories.map(async (memory) => {
        try {
          const result = await findRelatedMemories(memory.id, 5)
          return { ...memory, relatedIds: result.related_ids }
        } catch (err) {
          console.error('Failed to get links for ' + memory.id, err)
          return memory
        }
      })
    )

    console.log(`✅ Semantic relationships computed for ${memoriesWithLinks.length} memories`)
    return memoriesWithLinks
  } catch (err) {
    console.error('🔴 LEANN integration failed, using fallback:', err)
    return fallbackLinking(memories)
  }
}

function fallbackLinking(memories: Memory[]): Memory[] {
  console.log('⚙️  Fallback Mode: Linking by tags/categories (not semantic)')

  return memories.map(mem => {
    const category = mem.tags[0]
    const sameCategory = memories.filter(m => m.id !== mem.id && m.tags[0] === category)
    const relatedIds: string[] = []

    for (let k = 0; k < 2; k++) {
      if (sameCategory.length > k) {
        relatedIds.push(sameCategory[k].id)
      }
    }

    const random = memories[Math.floor(Math.random() * memories.length)]
    if (random.id !== mem.id && !relatedIds.includes(random.id)) {
      relatedIds.push(random.id)
    }

    return { ...mem, relatedIds }
  })
}
