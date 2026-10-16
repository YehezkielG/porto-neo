import { useState, useEffect } from 'react';
import { GetPengalaman, AddPengalaman, UpdatePengalaman, DeletePengalaman, BASE_URL, delay } from '../api/backendApi';
import Modal from './Modal';
import Button from './Button';
import Alert from './Alert';
import Loading from './Loading';
import type { FormEvent } from 'react';
import type { AlertState, Experience, ExperienceForm, TokenProps } from '../types';

const emptyForm: ExperienceForm = { nama_perusahaan: '', jabatan: '', tahun_mulai: '', tahun_selesai: '', gambar: null };

const Pengalaman = ({ token }: TokenProps) => {
  const [list, setList] = useState<Experience[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [isCurrent, setIsCurrent] = useState(true);
  const [form, setForm] = useState<ExperienceForm>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [alert, setAlert] = useState<AlertState>({ show: false, message: '', type: '' });

  // 1. Ambil data dari server
  const fetchData = async () => {
    if (!token) return;
    setIsLoadingData(true);
    try {
      const [res] = await Promise.all([GetPengalaman(token), delay(200)]);
      if (res.data.status === 'success') {
        setList(res.data.pengalaman || []);
      }
    } catch (err) {
      setAlert({ show: true, message: err.response?.data?.message || 'Failed to load experience records.', type: 'error' });
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
    setIsCurrent(true);
    setForm(emptyForm);
    setIsOpen(true);
  };

  // 3. Tombol Edit
  const handleOpenEdit = (item: Experience) => {
    setIsEdit(true);
    setCurrentId(item.id);
    setIsCurrent(!Number(item.tahun_selesai));
    setForm({
      nama_perusahaan: item.nama_perusahaan,
      jabatan: item.jabatan,
      tahun_mulai: String(item.tahun_mulai ?? ''),
      tahun_selesai: String(item.tahun_selesai ?? ''),
      gambar: null
    });
    setIsOpen(true);
  };

  // 4. Simpan Form (POST / PUT)
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = new FormData();
      Object.entries({ ...form, tahun_selesai: isCurrent ? 0 : form.tahun_selesai }).forEach(([key, value]) => {
        if (key !== 'gambar') payload.append(key, String(value ?? ''));
      });
      payload.append('token', token);
      if (form.gambar) payload.append('gambar', form.gambar);
      if (isEdit) {
        payload.append('id', String(currentId));
        await UpdatePengalaman(payload);
        setAlert({ show: true, message: 'Experience record updated successfully.', type: 'success' });
      } else {
        await AddPengalaman(payload);
        setAlert({ show: true, message: 'Experience record added successfully.', type: 'success' });
      }
      setIsOpen(false);
      fetchData();
    } catch (err) {
      setAlert({ show: true, message: err.response?.data?.message || 'Failed to save the experience record.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 5. Hapus Data (DELETE)
  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this experience record?')) return;
    try {
      await DeletePengalaman(id, token);
      setAlert({ show: true, message: 'Experience record deleted successfully.', type: 'success' });
      fetchData();
    } catch (err) {
      setAlert({ show: true, message: err.response?.data?.message || 'Failed to delete the experience record.', type: 'error' });
    }
  };

  return (
    <div>
      <div className="mb-[15px] flex justify-between gap-4 max-sm:flex-col">
        <h3>Experience Records</h3>
        <Button primary={true} text="+ Add Experience" onClick={handleOpenAdd} type="button" />
      </div>

      {isLoadingData ? (
        <Loading type="inline" title="Loading experience..." />
      ) : (
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Company</th>
              <th>Job Title</th>
              <th>Start Year</th>
              <th>End Year</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.nama_perusahaan}</td>
                <td>{item.jabatan}</td>
                <td>{item.tahun_mulai}</td>
                <td>{Number(item.tahun_selesai) ? item.tahun_selesai : 'Present'}</td>
                <td>
                  {item.gambar && (
                    <img
                      src={`${BASE_URL}/uploads/${item.gambar}`}
                      alt={`${item.nama_perusahaan} image`}
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

      {/* Add or edit experience */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={isEdit ? 'Edit Experience' : 'Add Experience'}
        isLoading={isSubmitting}
      >
        <form onSubmit={handleSubmit}>
          <label>Company</label>
          <input
            type="text"
            required
            value={form.nama_perusahaan}
            onChange={(e) => setForm({ ...form, nama_perusahaan: e.target.value })}
          />

          <label>Job Title</label>
          <input
            type="text"
            required
            value={form.jabatan}
            onChange={(e) => setForm({ ...form, jabatan: e.target.value })}
          />

          <label>Start Year</label>
          <input
            type="number"
            required
            value={form.tahun_mulai}
            onChange={(e) => setForm({ ...form, tahun_mulai: e.target.value })}
          />

          <label>End Year</label>
          <input
            type="number"
            required={!isCurrent}
            disabled={isCurrent}
            value={form.tahun_selesai}
            onChange={(e) => setForm({ ...form, tahun_selesai: e.target.value })}
          />
          <label className="-mb-1.5 flex items-center gap-2.5 font-semibold text-[var(--muted)]">
            <input type="checkbox" checked={isCurrent} onChange={(e) => setIsCurrent(e.target.checked)} />
            Currently working here
          </label>

          <label>Image (JPG, PNG, WebP; max 5 MB)</label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setForm({ ...form, gambar: e.target.files?.[0] || null })}
          />
          {isEdit && list.find((item) => item.id === currentId)?.gambar && (
            <img
              src={`${BASE_URL}/uploads/${list.find((item) => item.id === currentId)?.gambar || ''}`}
              alt="Current experience image"
              className="mb-3 h-[75px] w-[100px] object-cover"
            />
          )}

          <div className="mt-2.5 flex justify-end">
            <Button
              primary={true}
              text={isEdit ? 'Save Changes' : 'Add Record'}
              disabled={isSubmitting}
            />
          </div>
        </form>
      </Modal>

      <Alert alert={alert} setAlert={setAlert} />
    </div>
  );
};

export default Pengalaman;
