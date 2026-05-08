import { create } from 'zustand'
import type { HealthState, ProviderState, ReviewOutcome, StudyArchive, WordPack } from '../types/study'
import { applyReviewOutcome, createEmptyArchive, createInitialProgress, ensurePackProgress } from '../lib/reviewQueue'

interface StudyState {
  archive: StudyArchive
  hasUnsavedChanges: boolean
  remoteError: string
  health: HealthState | null
  providers: ProviderState
  createArchive: () => void
  importArchive: (archive: StudyArchive) => void
  addPack: (pack: WordPack) => void
  removePack: (packId: string) => void
  reviewCard: (cardId: string, outcome: ReviewOutcome) => void
  markSaved: () => void
  setRemoteError: (message: string) => void
  setHealth: (health: HealthState | null) => void
  setProviders: (providers: ProviderState) => void
}

const emptyProviders: ProviderState = {
  defaultProvider: 'openai-compatible',
  providers: [],
}

export const useStudyStore = create<StudyState>((set) => ({
  archive: createEmptyArchive(),
  hasUnsavedChanges: false,
  remoteError: '',
  health: null,
  providers: emptyProviders,
  createArchive: () =>
    set({
      archive: createEmptyArchive(),
      hasUnsavedChanges: false,
    }),
  importArchive: (archive) =>
    set({
      archive,
      hasUnsavedChanges: false,
    }),
  addPack: (pack) =>
    set((state) => ({
      archive: {
        ...state.archive,
        packs: [pack, ...state.archive.packs],
        progress: ensurePackProgress(state.archive, pack),
      },
      hasUnsavedChanges: true,
    })),
  removePack: (packId) =>
    set((state) => {
      const nextPacks = state.archive.packs.filter((pack) => pack.id !== packId)
      const nextProgress = { ...state.archive.progress }
      state.archive.packs
        .find((pack) => pack.id === packId)
        ?.cards.forEach((card) => {
          delete nextProgress[card.id]
        })

      return {
        archive: {
          ...state.archive,
          packs: nextPacks,
          progress: nextProgress,
        },
        hasUnsavedChanges: true,
      }
    }),
  reviewCard: (cardId, outcome) =>
    set((state) => ({
      archive: {
        ...state.archive,
        progress: {
          ...state.archive.progress,
          [cardId]: applyReviewOutcome(state.archive.progress[cardId] || createInitialProgress(), outcome),
        },
      },
      hasUnsavedChanges: true,
    })),
  markSaved: () => set({ hasUnsavedChanges: false }),
  setRemoteError: (message) => set({ remoteError: message }),
  setHealth: (health) => set({ health }),
  setProviders: (providers) => set({ providers }),
}))
