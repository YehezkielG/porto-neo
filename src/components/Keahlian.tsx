import { useState, useEffect } from 'react';
import { GetKeahlian, AddKeahlian, UpdateKeahlian, DeleteKeahlian, delay } from '../api/backendApi';
import Modal from './Modal';
import Button from './Button';
import Alert from './Alert';
import Loading from './Loading';
import type { FormEvent } from 'react';
import type { AlertState, Skill, SkillLevel, TokenProps } from '../types';

interface SkillForm { nama_keahlian: string; level: SkillLevel }

const Keahlian = ({ token }: TokenProps) => {
  const [list, setList] = useState<Skill[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [form, setForm] = useState<SkillForm>({ nama_keahlian: '', level: 'Basic' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [alert, setAlert] = useState<AlertState>({ show: false, message: '', type: '' });

  // 1. Ambil data dari server
  const fetchData = async () => {
    if (!token) return;
    setIsLoadingData(true);
    try {
      const [res] = await Promise.all([GetKeahlian(token), delay(200)]);
      if (res.data.status === 'success') {
        setList(res.data.keahlian || []);
      }
    } catch (err) {
      setAlert({ show: true, message: 'Failed to load skills.', type: 'error' });
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
    setForm({ nama_keahlian: '', level: 'Basic' });
    setIsOpen(true);
  };

  // 3. Tombol Edit
  const handleOpenEdit = (item: Skill) => {
    setIsEdit(true);
    setCurrentId(item.id);
    setForm({ nama_keahlian: item.nama_keahlian, level: item.level });
    setIsOpen(true);
  };

  // 4. Simpan Form (POST / PUT)
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isEdit) {
        await UpdateKeahlian({ ...form, token, id: currentId });
        setAlert({ show: true, message: 'Skill updated successfully.', type: 'success' });
      } else {
        await AddKeahlian({ ...form, token });
        setAlert({ show: true, message: 'Skill added successfully.', type: 'success' });
      }
      setIsOpen(false);
      fetchData();
    } catch (err) {
      setAlert({ show: true, message: 'Failed to save the skill.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 5. Hapus Data (DELETE)
  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this skill?')) return;
    try {
      await DeleteKeahlian(id, token);
      setAlert({ show: true, message: 'Skill deleted successfully.', type: 'success' });
      fetchData();
    } catch (err) {
      setAlert({ show: true, message: 'Failed to delete the skill.', type: 'error' });
    }
  };

  return (
    <div>
      <div className="mb-[15px] flex justify-between gap-4 max-sm:flex-col">
        <h3>Skills</h3>
        <Button primary={true} text="+ Add Skill" onClick={handleOpenAdd} type="button" />
      </div>

      {isLoadingData ? (
        <Loading type="inline" title="Loading skills..." />
      ) : (
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Skill Name</th>
              <th>Level</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.nama_keahlian}</td>
                <td>{item.level}</td>
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

      {/* Add or edit skill */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={isEdit ? 'Edit Skill' : 'Add Skill'}
        isLoading={isSubmitting}
      >
        <form onSubmit={handleSubmit}>
          <label>Skill Name</label>
          <input
            type="text"
            required
            value={form.nama_keahlian}
            onChange={(e) => setForm({ ...form, nama_keahlian: e.target.value })}
          />

          <label htmlFor="skill-level">Skill level</label>
          <select
            id="skill-level"
            required
            value={form.level}
            onChange={(e) => setForm({ ...form, level: e.target.value as SkillLevel })}
          >
            <option value="Basic">Basic</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

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

export default Keahlian;
