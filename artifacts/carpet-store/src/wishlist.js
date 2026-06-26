const WISHLIST_KEY = 'carpet_wishlist';

export const Wishlist = {
  get() {
    try {
      return JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]');
    } catch {
      return [];
    }
  },

  save(ids) {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(ids));
    window.dispatchEvent(new CustomEvent('wishlist-changed', { detail: { count: ids.length } }));
  },

  has(id) {
    return this.get().includes(id);
  },

  toggle(id) {
    const ids = this.get();
    const idx = ids.indexOf(id);
    if (idx === -1) {
      ids.push(id);
    } else {
      ids.splice(idx, 1);
    }
    this.save(ids);
    return idx === -1; // true = added, false = removed
  },

  count() {
    return this.get().length;
  },

  clear() {
    this.save([]);
  }
};
