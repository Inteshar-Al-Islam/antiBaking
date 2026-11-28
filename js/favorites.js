import { CONFIG } from './config.js';

/**
 * Safely reads saved product IDs from localStorage, returning a deduplicated array.
 */
export function loadSavedIds(storageKey = CONFIG.favoritesStorageKey) {
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const unique = [];
    const seen = new Set();
    for (const item of parsed) {
      if (typeof item === 'string' && item && !seen.has(item)) {
        seen.add(item);
        unique.push(item);
      }
    }
    return unique;
  } catch {
    return [];
  }
}

/**
 * Safely persists saved product IDs to localStorage.
 */
export function saveSavedIds(savedIds, storageKey = CONFIG.favoritesStorageKey) {
  try {
    const sanitized = Array.isArray(savedIds) ? [...new Set(savedIds.filter(id => typeof id === 'string' && id))] : [];
    if (sanitized.length === 0) {
      window.localStorage.removeItem(storageKey);
    } else {
      window.localStorage.setItem(storageKey, JSON.stringify(sanitized));
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Filters out any saved IDs that no longer exist in the loaded catalog.
 */
export function pruneSavedIds(savedIds, products) {
  if (!Array.isArray(products) || products.length === 0) return [];
  const validIds = new Set(products.map(p => p.id));
  const seen = new Set();
  const pruned = [];
  for (const id of savedIds) {
    if (validIds.has(id) && !seen.has(id)) {
      seen.add(id);
      pruned.push(id);
    }
  }
  return pruned;
}

/**
 * Toggles a product ID in the saved list and returns { savedIds, isSaved }.
 */
export function toggleSavedId(savedIds, productId) {
  if (!productId) return { savedIds, isSaved: false };
  const exists = savedIds.includes(productId);
  const nextIds = exists ? savedIds.filter(id => id !== productId) : [...savedIds, productId];
  return { savedIds: nextIds, isSaved: !exists };
}

/**
 * Resolves saved IDs (in saved order) to full normalized product objects.
 */
export function getSavedProducts(savedIds, products) {
  if (!Array.isArray(savedIds) || !Array.isArray(products) || savedIds.length === 0) {
    return [];
  }
  const byId = new Map(products.map(p => [p.id, p]));
  const result = [];
  for (const id of savedIds) {
    const match = byId.get(id);
    if (match) result.push(match);
  }
  return result;
}
