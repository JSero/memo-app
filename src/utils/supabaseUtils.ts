import { supabase } from '@/lib/supabase'
import { Memo, MemoFormData } from '@/types/memo'

export const supabaseUtils = {
  // 모든 메모 가져오기
  getMemos: async (): Promise<Memo[]> => {
    try {
      const { data, error } = await supabase
        .from('memos')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading memos from Supabase:', error)
        return []
      }

      // 데이터베이스 형식을 앱 형식으로 변환
      return data.map(memo => ({
        id: memo.id,
        title: memo.title,
        content: memo.content,
        category: memo.category,
        tags: memo.tags || [],
        createdAt: memo.created_at,
        updatedAt: memo.updated_at,
      }))
    } catch (error) {
      console.error('Error loading memos from Supabase:', error)
      return []
    }
  },

  // 메모 추가
  addMemo: async (memoData: MemoFormData): Promise<Memo | null> => {
    try {
      const { data, error } = await supabase
        .from('memos')
        .insert([
          {
            title: memoData.title,
            content: memoData.content,
            category: memoData.category,
            tags: memoData.tags,
          },
        ])
        .select()
        .single()

      if (error) {
        console.error('Error adding memo to Supabase:', error)
        return null
      }

      // 데이터베이스 형식을 앱 형식으로 변환
      return {
        id: data.id,
        title: data.title,
        content: data.content,
        category: data.category,
        tags: data.tags || [],
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }
    } catch (error) {
      console.error('Error adding memo to Supabase:', error)
      return null
    }
  },

  // 메모 업데이트
  updateMemo: async (id: string, memoData: MemoFormData): Promise<Memo | null> => {
    try {
      const { data, error } = await supabase
        .from('memos')
        .update({
          title: memoData.title,
          content: memoData.content,
          category: memoData.category,
          tags: memoData.tags,
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating memo in Supabase:', error)
        return null
      }

      // 데이터베이스 형식을 앱 형식으로 변환
      return {
        id: data.id,
        title: data.title,
        content: data.content,
        category: data.category,
        tags: data.tags || [],
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }
    } catch (error) {
      console.error('Error updating memo in Supabase:', error)
      return null
    }
  },

  // 메모 삭제
  deleteMemo: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('memos')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting memo from Supabase:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error deleting memo from Supabase:', error)
      return false
    }
  },

  // 특정 메모 가져오기
  getMemoById: async (id: string): Promise<Memo | null> => {
    try {
      const { data, error } = await supabase
        .from('memos')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error loading memo from Supabase:', error)
        return null
      }

      // 데이터베이스 형식을 앱 형식으로 변환
      return {
        id: data.id,
        title: data.title,
        content: data.content,
        category: data.category,
        tags: data.tags || [],
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }
    } catch (error) {
      console.error('Error loading memo from Supabase:', error)
      return null
    }
  },

  // 메모 검색
  searchMemos: async (query: string): Promise<Memo[]> => {
    try {
      const { data, error } = await supabase
        .from('memos')
        .select('*')
        .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error searching memos in Supabase:', error)
        return []
      }

      // 데이터베이스 형식을 앱 형식으로 변환
      return data.map(memo => ({
        id: memo.id,
        title: memo.title,
        content: memo.content,
        category: memo.category,
        tags: memo.tags || [],
        createdAt: memo.created_at,
        updatedAt: memo.updated_at,
      }))
    } catch (error) {
      console.error('Error searching memos in Supabase:', error)
      return []
    }
  },

  // 카테고리별 메모 필터링
  getMemosByCategory: async (category: string): Promise<Memo[]> => {
    try {
      let query = supabase
        .from('memos')
        .select('*')
        .order('created_at', { ascending: false })

      if (category !== 'all') {
        query = query.eq('category', category)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error loading memos by category from Supabase:', error)
        return []
      }

      // 데이터베이스 형식을 앱 형식으로 변환
      return data.map(memo => ({
        id: memo.id,
        title: memo.title,
        content: memo.content,
        category: memo.category,
        tags: memo.tags || [],
        createdAt: memo.created_at,
        updatedAt: memo.updated_at,
      }))
    } catch (error) {
      console.error('Error loading memos by category from Supabase:', error)
      return []
    }
  },

  // 모든 메모 삭제
  clearAllMemos: async (): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('memos')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000') // 모든 레코드 삭제

      if (error) {
        console.error('Error clearing all memos from Supabase:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error clearing all memos from Supabase:', error)
      return false
    }
  },
}