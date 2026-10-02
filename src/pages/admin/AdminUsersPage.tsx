import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  ShieldCheck,
  UserCheck,
  Mail,
  Lock,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Eye,
  EyeOff,
  RefreshCw,
  Search,
  KeyRound,
  X,
  UserCog,
} from 'lucide-react';
import { UserProfile, UserRole } from '../../types/property';
import { authService } from '../../lib/supabase';

interface AdminUsersPageProps {
  userProfile?: UserProfile | null;
}

export const AdminUsersPage: React.FC<AdminUsersPageProps> = ({ userProfile }) => {
  const isSuperadmin = userProfile?.role === 'superadmin';

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'superadmin' | 'corredor'>('all');

  // Modal State for New User
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>('corredor');
  const [submitting, setSubmitting] = useState(false);
  const [formMsg, setFormMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Modal State for Delete
  const [userToDelete, setUserToDelete] = useState<UserProfile | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Load users
  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await authService.getProfiles();
      setUsers(data);
    } catch (err: any) {
      console.error('Error cargando usuarios:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Filter users
  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = (u.full_name || '').toLowerCase().includes(q);
      const matchEmail = u.email.toLowerCase().includes(q);
      return matchName || matchEmail;
    }
    return true;
  });

  const superadminsCount = users.filter((u) => u.role === 'superadmin').length;
  const corredoresCount = users.filter((u) => u.role === 'corredor').length;

  // Handle Create User
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormMsg(null);

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setFormMsg({ text: 'Por favor completá todos los campos.', type: 'error' });
      return;
    }

    if (password.length < 6) {
      setFormMsg({ text: 'La contraseña debe tener al menos 6 caracteres.', type: 'error' });
      return;
    }

    setSubmitting(true);
    try {
      await authService.createUser({
        fullName: fullName.trim(),
        email: email.trim(),
        password: password.trim(),
        role,
      });

      setFormMsg({
        text: `¡Usuario ${fullName.trim()} registrado con éxito como ${role === 'superadmin' ? 'Superadmin' : 'Corredor'}!`,
        type: 'success',
      });

      // Limpiar formulario tras éxito
      setFullName('');
      setEmail('');
      setPassword('');
      setRole('corredor');
      loadUsers();

      setTimeout(() => {
        setShowCreateModal(false);
        setFormMsg(null);
      }, 2000);
    } catch (err: any) {
      console.error('Error creando usuario:', err);
      let errorText = err.message || 'Error al registrar el usuario en Supabase.';
      if (errorText.toLowerCase().includes('already registered')) {
        errorText = 'Este correo electrónico ya se encuentra registrado en el sistema.';
      }
      setFormMsg({ text: errorText, type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  // Generate random password
  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let res = '';
    for (let i = 0; i < 10; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(res);
    setShowPassword(true);
  };

  // Handle Role Toggle
  const handleToggleRole = async (targetUser: UserProfile) => {
    if (targetUser.id === userProfile?.id) {
      alert('No podés modificar tu propio rol activo.');
      return;
    }

    const newRole: UserRole = targetUser.role === 'superadmin' ? 'corredor' : 'superadmin';
    const confirmMsg = `¿Deseás cambiar el rol de ${targetUser.full_name || targetUser.email} a ${newRole === 'superadmin' ? 'Superadministrador' : 'Corredor'}?`;
    
    if (!window.confirm(confirmMsg)) return;

    try {
      await authService.updateRole(targetUser.id, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, role: newRole } : u))
      );
    } catch (err: any) {
      alert(err.message || 'Error al cambiar el rol.');
    }
  };

  // Handle Delete User
  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    setDeleting(true);
    try {
      await authService.deleteProfile(userToDelete.id);
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      setUserToDelete(null);
    } catch (err: any) {
      alert(err.message || 'Error al eliminar el usuario.');
    } finally {
      setDeleting(false);
    }
  };

  if (!isSuperadmin) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-zinc-200 shadow-sm max-w-lg mx-auto text-center space-y-4">
        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="font-archivo text-lg font-bold text-zinc-900">
          Acceso Restringido
        </h2>
        <p className="text-xs text-zinc-500 font-light">
          Solo los usuarios con rol <strong>Superadministrador</strong> tienen permisos para dar de alta nuevos usuarios y gestionar el equipo en el CRM.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-adelina-sand text-adelina-dark px-3 py-1 rounded-full text-xs font-semibold mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-adelina-accent" />
            <span>Gestión de Accesos & Seguridad</span>
          </div>
          <h1 className="font-archivo text-2xl sm:text-3xl font-bold text-zinc-900">
            Usuarios del CRM
          </h1>
          <p className="text-xs text-zinc-500 font-light">
            Alta de corredores inmobiliarios, asignación de permisos y control de credenciales.
          </p>
        </div>

        <button
          onClick={() => {
            setShowCreateModal(true);
            setFormMsg(null);
          }}
          className="bg-adelina-dark hover:bg-black text-white font-medium px-4 py-2.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4 text-adelina-accent" />
          <span>Registrar Nuevo Usuario</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
              Total Equipo
            </span>
            <span className="font-archivo text-2xl font-bold text-zinc-900">
              {users.length}
            </span>
            <span className="text-[11px] text-zinc-400 font-light block">
              Cuentas registradas
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-zinc-100 text-zinc-700 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider block">
              Superadmins
            </span>
            <span className="font-archivo text-2xl font-bold text-amber-900">
              {superadminsCount}
            </span>
            <span className="text-[11px] text-zinc-400 font-light block">
              Control total del panel
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider block">
              Corredores
            </span>
            <span className="font-archivo text-2xl font-bold text-blue-900">
              {corredoresCount}
            </span>
            <span className="text-[11px] text-zinc-400 font-light block">
              Carga y venta de inmuebles
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nombre o correo electrónico..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-9 pr-3.5 py-2 text-xs sm:text-sm text-zinc-800 focus:outline-none focus:border-adelina-accent"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-700 focus:outline-none focus:border-adelina-accent"
          >
            <option value="all">Todos los roles ({users.length})</option>
            <option value="superadmin">Superadmin ({superadminsCount})</option>
            <option value="corredor">Corredores ({corredoresCount})</option>
          </select>

          <button
            onClick={loadUsers}
            title="Refrescar listado"
            className="p-2 border border-zinc-200 rounded-xl hover:bg-zinc-50 text-zinc-500 hover:text-zinc-800 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-zinc-400 space-y-3">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-adelina-accent" />
            <p className="text-xs">Cargando usuarios del CRM...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-zinc-400 space-y-2">
            <Users className="w-8 h-8 mx-auto text-zinc-300" />
            <p className="text-sm font-medium text-zinc-600">No se encontraron usuarios</p>
            <p className="text-xs text-zinc-400">Probá ajustando el filtro de búsqueda.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {filteredUsers.map((user) => {
              const isCurrentUser = user.id === userProfile?.id;
              const initials = (user.full_name || user.email)
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);

              const formattedDate = user.created_at
                ? new Date(user.created_at).toLocaleDateString('es-AR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })
                : '-';

              return (
                <div
                  key={user.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-50/70 transition-colors"
                >
                  {/* User info */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-xs shrink-0 shadow-sm ${
                        user.role === 'superadmin'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}
                    >
                      {initials}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-archivo font-bold text-sm text-zinc-900 truncate">
                          {user.full_name || 'Sin nombre asignado'}
                        </span>
                        {isCurrentUser && (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                            Tu cuenta activa
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-zinc-500 font-light mt-0.5">
                        <span className="flex items-center gap-1 truncate">
                          <Mail className="w-3 h-3 text-zinc-400 shrink-0" />
                          <span>{user.email}</span>
                        </span>
                        <span>•</span>
                        <span className="text-[11px] text-zinc-400">
                          Alta: {formattedDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Role Badge */}
                  <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                    {/* Role Pill */}
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold ${
                        user.role === 'superadmin'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}
                    >
                      {user.role === 'superadmin' ? (
                        <>
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                          <span>Superadmin</span>
                        </>
                      ) : (
                        <>
                          <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                          <span>Corredor</span>
                        </>
                      )}
                    </span>

                    {/* Change Role Button */}
                    {!isCurrentUser && (
                      <button
                        onClick={() => handleToggleRole(user)}
                        title="Cambiar rol (Superadmin / Corredor)"
                        className="px-2.5 py-1.5 rounded-xl border border-zinc-200 hover:bg-white text-zinc-600 hover:text-zinc-900 text-xs font-medium flex items-center gap-1 transition-colors"
                      >
                        <UserCog className="w-3.5 h-3.5 text-zinc-500" />
                        <span className="hidden md:inline">Cambiar Rol</span>
                      </button>
                    )}

                    {/* Delete User Button */}
                    {!isCurrentUser && (
                      <button
                        onClick={() => setUserToDelete(user)}
                        title="Eliminar usuario del CRM"
                        className="p-2 rounded-xl text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL: REGISTRAR NUEVO USUARIO */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-zinc-200 space-y-5 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-adelina-sand text-adelina-dark flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-adelina-accent" />
                </div>
                <div>
                  <h3 className="font-archivo text-base font-bold text-zinc-900">
                    Registrar Nuevo Usuario al CRM
                  </h3>
                  <p className="text-[11px] text-zinc-500">
                    Creá una cuenta para un miembro del equipo inmobiliario
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 text-zinc-400 hover:text-zinc-600 rounded-lg hover:bg-zinc-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Notification messages */}
            {formMsg && (
              <div
                className={`p-3.5 rounded-xl text-xs flex items-center gap-2.5 ${
                  formMsg.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {formMsg.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{formMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-4">
              {/* Nombre Completo */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Florencia Corredora"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-adelina-accent"
                />
              </div>

              {/* Correo Electrónico */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Correo Electrónico (Acceso)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="ejemplo@adelinainmobiliaria.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-adelina-accent"
                  />
                </div>
              </div>

              {/* Contraseña Inicial */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-zinc-700">
                    Contraseña Inicial
                  </label>
                  <button
                    type="button"
                    onClick={generatePassword}
                    className="text-[11px] text-adelina-dark font-semibold hover:underline flex items-center gap-1"
                  >
                    <KeyRound className="w-3 h-3 text-adelina-accent" />
                    <span>Generar segura</span>
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-9 pr-10 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-adelina-accent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Selector de Rol */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-2">
                  Rol y Nivel de Acceso
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <label
                    className={`p-3.5 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${
                      role === 'corredor'
                        ? 'border-blue-500 bg-blue-50/50 shadow-sm'
                        : 'border-zinc-200 hover:bg-zinc-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="flex items-center gap-1.5 font-bold text-xs text-blue-900">
                        <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                        <span>Corredor</span>
                      </span>
                      <input
                        type="radio"
                        name="role"
                        value="corredor"
                        checked={role === 'corredor'}
                        onChange={() => setRole('corredor')}
                        className="text-blue-600"
                      />
                    </div>
                    <span className="text-[11px] text-zinc-500 font-light leading-relaxed">
                      Gestión y carga exclusiva de propiedades e inventario inmobiliario.
                    </span>
                  </label>

                  <label
                    className={`p-3.5 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${
                      role === 'superadmin'
                        ? 'border-amber-500 bg-amber-50/50 shadow-sm'
                        : 'border-zinc-200 hover:bg-zinc-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="flex items-center gap-1.5 font-bold text-xs text-amber-900">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                        <span>Superadmin</span>
                      </span>
                      <input
                        type="radio"
                        name="role"
                        value="superadmin"
                        checked={role === 'superadmin'}
                        onChange={() => setRole('superadmin')}
                        className="text-amber-600"
                      />
                    </div>
                    <span className="text-[11px] text-zinc-500 font-light leading-relaxed">
                      Control total: métricas, leads, testimonios, categorías y usuarios.
                    </span>
                  </label>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="pt-3 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-medium text-zinc-600 hover:bg-zinc-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-adelina-dark hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin text-adelina-accent" />}
                  <span>Crear Usuario</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CONFIRMAR ELIMINACIÓN */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-zinc-200 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-archivo text-base font-bold text-zinc-900">
                ¿Eliminar este usuario?
              </h3>
              <p className="text-xs text-zinc-500 font-light">
                Se revocará el acceso de <strong>{userToDelete.full_name || userToDelete.email}</strong> al CRM de forma inmediata.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-600 hover:bg-zinc-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={confirmDeleteUser}
                className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow transition-all active:scale-95 disabled:opacity-50"
              >
                {deleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Eliminar Acceso</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
