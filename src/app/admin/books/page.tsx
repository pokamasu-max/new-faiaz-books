"use client";

import { useEffect, useState } from "react";
import {
  formatPrice,
  SUBJECTS,
  PROGRAMS,
  ALL_YEARS,
  BOOK_TYPES,
} from "@/lib/format";

type Book = {
  id: string;
  title: string;
  titleBn: string;
  author: string;
  publisher: string;
  description: string;
  price: number;
  program: string;
  year: string;
  category: string;
  bookType: string;
  coverImage: string;
  stock: number;
  rating: number;
  featured: boolean;
};

const empty = {
  title: "",
  titleBn: "",
  author: "",
  publisher: "",
  description: "",
  price: 0,
  program: "Honours",
  year: "1st Year",
  category: "Accounting",
  bookType: "Textbook",
  coverImage: "",
  stock: 0,
  rating: 0,
  featured: false,
};

export default function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/books");
    const data = await res.json();
    setBooks(data.books ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function openNew() {
    setError("");
    setEditing({ ...empty });
  }
  function openEdit(b: Book) {
    setError("");
    setEditing({ ...b });
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const isEdit = Boolean(editing.id);
    const res = await fetch(
      isEdit ? `/api/admin/books/${editing.id}` : "/api/admin/books",
      {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      }
    );
    setSaving(false);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d.error ?? "Could not save.");
      return;
    }
    setEditing(null);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this book?")) return;
    const res = await fetch(`/api/admin/books/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      alert(d.error ?? "Could not delete.");
      return;
    }
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-ink">Manage Books</h1>
        <button onClick={openNew} className="btn-primary">
          + Add book
        </button>
      </div>

      {loading ? (
        <p className="mt-6 text-ink-light">Loading…</p>
      ) : (
        <div className="card mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase text-ink-light">
              <tr>
                <th className="px-4 py-3">Book</th>
                <th className="px-4 py-3">Program / Year</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {books.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={b.coverImage}
                        alt=""
                        className="h-12 w-9 rounded object-cover"
                      />
                      <div>
                        <p className="font-medium text-ink">
                          {b.title} {b.featured && "⭐"}
                        </p>
                        <p className="text-xs text-ink-light">
                          {b.titleBn || b.author}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink-light">
                    {b.program}
                    <br />
                    <span className="text-xs">{b.year}</span>
                  </td>
                  <td className="px-4 py-3 text-ink-light">{b.category}</td>
                  <td className="px-4 py-3 text-ink-light">{b.bookType}</td>
                  <td className="px-4 py-3 font-medium">{formatPrice(b.price)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        b.stock === 0
                          ? "text-red-600"
                          : b.stock <= 10
                          ? "text-amber-600"
                          : "text-ink"
                      }
                    >
                      {b.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => openEdit(b)}
                      className="mr-2 font-medium text-brand-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => remove(b.id)}
                      className="font-medium text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <div className="w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl" style={{ maxHeight: "90vh" }}>
            <h2 className="text-lg font-bold text-ink">
              {editing.id ? "Edit book" : "Add new book"}
            </h2>
            {error && (
              <p className="mt-2 rounded bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            )}
            <form onSubmit={save} className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="mb-1 block text-sm font-medium">
                    Title (English)
                  </label>
                  <input
                    required
                    className="input"
                    value={editing.title}
                    onChange={(e) =>
                      setEditing({ ...editing, title: e.target.value })
                    }
                  />
                </div>
                <div className="col-span-2">
                  <label className="mb-1 block text-sm font-medium">
                    Title (Bangla) — শিরোনাম
                  </label>
                  <input
                    className="input"
                    placeholder="বইয়ের বাংলা নাম"
                    value={editing.titleBn}
                    onChange={(e) =>
                      setEditing({ ...editing, titleBn: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Author</label>
                  <input
                    required
                    className="input"
                    value={editing.author}
                    onChange={(e) =>
                      setEditing({ ...editing, author: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Publisher
                  </label>
                  <input
                    className="input"
                    placeholder="Lecture / Panjeree / Royal..."
                    value={editing.publisher}
                    onChange={(e) =>
                      setEditing({ ...editing, publisher: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Program</label>
                  <select
                    className="input"
                    value={editing.program}
                    onChange={(e) =>
                      setEditing({ ...editing, program: e.target.value })
                    }
                  >
                    {PROGRAMS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Year</label>
                  <select
                    className="input"
                    value={editing.year}
                    onChange={(e) =>
                      setEditing({ ...editing, year: e.target.value })
                    }
                  >
                    {ALL_YEARS.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Subject</label>
                  <select
                    className="input"
                    value={editing.category}
                    onChange={(e) =>
                      setEditing({ ...editing, category: e.target.value })
                    }
                  >
                    {SUBJECTS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Book type</label>
                  <select
                    className="input"
                    value={editing.bookType}
                    onChange={(e) =>
                      setEditing({ ...editing, bookType: e.target.value })
                    }
                  >
                    {BOOK_TYPES.map((bt) => (
                      <option key={bt} value={bt}>
                        {bt}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Price (৳)</label>
                  <input
                    type="number"
                    className="input"
                    value={editing.price}
                    onChange={(e) =>
                      setEditing({ ...editing, price: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Stock</label>
                  <input
                    type="number"
                    className="input"
                    value={editing.stock}
                    onChange={(e) =>
                      setEditing({ ...editing, stock: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Rating (0-5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    className="input"
                    value={editing.rating}
                    onChange={(e) =>
                      setEditing({ ...editing, rating: e.target.value })
                    }
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <input
                      type="checkbox"
                      checked={editing.featured}
                      onChange={(e) =>
                        setEditing({ ...editing, featured: e.target.checked })
                      }
                    />
                    Featured
                  </label>
                </div>
                <div className="col-span-2">
                  <label className="mb-1 block text-sm font-medium">
                    Cover image URL (optional)
                  </label>
                  <input
                    className="input"
                    placeholder="Leave blank to auto-generate"
                    value={editing.coverImage}
                    onChange={(e) =>
                      setEditing({ ...editing, coverImage: e.target.value })
                    }
                  />
                </div>
                <div className="col-span-2">
                  <label className="mb-1 block text-sm font-medium">Description</label>
                  <textarea
                    rows={3}
                    className="input"
                    value={editing.description}
                    onChange={(e) =>
                      setEditing({ ...editing, description: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="rounded-lg px-4 py-2 font-medium text-ink-light hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn-primary">
                  {saving ? "Saving…" : "Save book"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
