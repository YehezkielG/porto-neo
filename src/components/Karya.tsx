import { useState, useEffect } from 'react';
import { GetKarya, AddKarya, UpdateKarya, DeleteKarya, BASE_URL, delay } from '../api/backendApi';
import Modal from './Modal';
import Button from './Button';
import Alert from './Alert';
import Loading from './Loading';
import type { FormEvent } from 'react';
import type { AlertState, Project, ProjectForm, TokenProps } from '../types';

const emptyForm: ProjectForm = { nama_karya: '', deskripsi: '', url: '', gambar: null };

const Karya = ({ token }: TokenProps) => {
  const [list, setList] = useState<Project[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [form, setForm] = useState<ProjectForm>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [alert, setAlert] = useState<AlertState>({ show: false, message: '', type: '' });

  // 1. Ambil data dari server
  const fetchData = async () => {
    if (!token) return;
    setIsLoadingData(true);
    try {
      const [res] = await Promise.all([GetKarya(token), delay(200)]);
      if (res.data.status === 'success') {
        setList(res.data.karya_terbaik || []);
      }
    } catch (err) {
      setAlert({ show: true, message: err.response?.data?.message || 'Failed to load projects.', type: 'error' });
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  // 2. Tombol Tambah Baru
  const handleOpenAdd = () => {
    setIsEdit(false);
    setCurrentId(null);
    setForm(emptyForm);
    setIsOpen(true);
  };

  // 3. Tombol Edit
  const handleOpenEdit = (item: Project) => {
    setIsEdit(true);
    setCurrentId(item.id);
    setForm({ nama_karya: item.nama_karya, deskripsi: item.deskripsi, url: item.url || '', gambar: null });
    setIsOpen(true);
  };

  // 4. Simpan Form (POST / PUT)
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key !== 'gambar') payload.append(key, String(value ?? ''));
      });
      payload.append('token', token);
      if (form.gambar) payload.append('gambar', form.gambar);
      if (isEdit) {
        payload.append('id', String(currentId));
        await UpdateKarya(payload);
        setAlert({ show: true, message: 'Project updated successfully.', type: 'success' });
      } else {
        await AddKarya(payload);
        setAlert({ show: true, message: 'Project added successfully.', type: 'success' });
      }
      setIsOpen(false);
      fetchData();
    } catch (err) {
      setAlert({ show: true, message: err.response?.data?.message || 'Failed to save the project.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 5. Hapus Data (DELETE)
  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await DeleteKarya(id, token);
      setAlert({ show: true, message: 'Project deleted successfully.', type: 'success' });
      fetchData();
    } catch (err) {
      setAlert({ show: true, message: err.response?.data?.message || 'Failed to delete the project.', type: 'error' });
    }
  };

  return (
    <div>
      <div className="mb-[15px] flex justify-between gap-4 max-sm:flex-col">
        <h3>Projects</h3>
        <Button primary={true} text="+ Add Project" onClick={handleOpenAdd} type="button" />
      </div>

      {isLoadingData ? (
        <Loading type="inline" title="Loading projects..." />
      ) : (
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Project Name</th>
              <th>Description</th>
              <th>Link</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.nama_karya}</td>
                <td>{item.deskripsi}</td>
                <td>
                  <a href={item.url} target="_blank" rel="noreferrer">
                    Visit
                  </a>
                </td>
                <td>
                  {item.gambar && (
                    <img
                      src={`${BASE_URL}/uploads/${item.gambar}`}
                      alt={`Image of ${item.nama_karya}`}
                      className="h-12 w-16 rounded object-cover"
                    />
                  )}
                </td>
                <td>
                  <button className="inline-flex min-h-[42px] items-center justify-center gap-2 border-2 border-black bg-[#fffdf5] px-3.5 py-[9px] text-xs font-extrabold leading-tight text-[#11131b] shadow-[4px_4px_0_var(--shadow-color)] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_var(--shadow-color)] disabled:cursor-not-allowed disabled:opacity-50" onClick={() => handleOpenEdit(item)}>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="ml-1.5 inline-flex min-h-[42px] items-center justify-center gap-2 border-2 border-black bg-[#fffdf5] px-3.5 py-[9px] text-xs font-extrabold leading-tight text-[#dc3545] shadow-[4px_4px_0_var(--shadow-color)] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_var(--shadow-color)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Add or edit project */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={isEdit ? 'Edit Project' : 'Add Project'}
        isLoading={isSubmitting}
      >
        <form onSubmit={handleSubmit}>
          <label>Project Name</label>
          <input
            type="text"
            required
            value={form.nama_karya}
            onChange={(e) => setForm({ ...form, nama_karya: e.target.value })}
          />

          <label>Description</label>
          <textarea
            required
            value={form.deskripsi}
            onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
          />

          <label>Project URL</label>
          <input
            type="text"
            required
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
          />

          <label>Image (JPG, PNG, WebP; max 5 MB)</label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setForm({ ...form, gambar: e.target.files?.[0] || null })}
          />
          {isEdit && list.find((item) => item.id === currentId)?.gambar && (
            <img
              src={`${BASE_URL}/uploads/${list.find((item) => item.id === currentId)?.gambar || ''}`}
              alt="Current project image"
              className="mb-3 h-[75px] w-[100px] object-cover"
            />
          )}

          <div className="mt-2.5 flex justify-end">
            <Button
              primary={true}
              text={isEdit ? 'Save Changes' : 'Add Project'}
              disabled={isSubmitting}
            />
          </div>
        </form>
      </Modal>

      <Alert alert={alert} setAlert={setAlert} />
    </div>
  );
};

export default Karya;
