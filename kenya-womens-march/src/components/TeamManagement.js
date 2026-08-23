import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  fetchTeamSectionData,
  updateTeamSectionTitle,
  createTeamGroup,
  updateTeamGroup,
  deleteTeamGroup,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  uploadTeamPhoto
} from '../supabaseHelpers';
import Notification from './Notification';

const emptyMemberForm = {
  name: '',
  photo_url: '',
  image_object_position: 'center'
};

const TeamManagement = () => {
  const [teamData, setTeamData] = useState({ sectionTitle: '', groups: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: 'success' });
  const [sectionTitle, setSectionTitle] = useState('');
  const [newGroupTitle, setNewGroupTitle] = useState('');
  const [newGroupLayout, setNewGroupLayout] = useState('compact');
  const [editingGroupId, setEditingGroupId] = useState(null);
  const [editingGroupTitle, setEditingGroupTitle] = useState('');
  const [editingGroupLayout, setEditingGroupLayout] = useState('compact');
  const [addingMemberGroupId, setAddingMemberGroupId] = useState(null);
  const [memberForm, setMemberForm] = useState(emptyMemberForm);
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [uploadingPhotoFor, setUploadingPhotoFor] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: 'success' }), 5000);
  };

  const loadTeamData = async () => {
    try {
      setLoading(true);
      const data = await fetchTeamSectionData();
      setTeamData(data);
      setSectionTitle(data.sectionTitle);
    } catch (error) {
      console.error('Error loading team data:', error);
      showNotification('Failed to load team data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeamData();
  }, []);

  const handleSaveSectionTitle = async () => {
    try {
      setSaving(true);
      await updateTeamSectionTitle(sectionTitle.trim() || 'Meet Our Team');
      showNotification('Section title updated successfully!');
      loadTeamData();
    } catch (error) {
      showNotification(error.message || 'Failed to update section title.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleAddGroup = async () => {
    if (!newGroupTitle.trim()) {
      showNotification('Please enter a team group title.', 'error');
      return;
    }

    try {
      setSaving(true);
      await createTeamGroup({
        title: newGroupTitle.trim(),
        layout: newGroupLayout,
        display_order: teamData.groups.length
      });
      setNewGroupTitle('');
      setNewGroupLayout('compact');
      showNotification('Team group added successfully!');
      loadTeamData();
    } catch (error) {
      showNotification(error.message || 'Failed to add team group.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveGroup = async (groupId) => {
    if (!editingGroupTitle.trim()) {
      showNotification('Please enter a team group title.', 'error');
      return;
    }

    try {
      setSaving(true);
      await updateTeamGroup(groupId, {
        title: editingGroupTitle.trim(),
        layout: editingGroupLayout
      });
      setEditingGroupId(null);
      showNotification('Team group updated successfully!');
      loadTeamData();
    } catch (error) {
      showNotification(error.message || 'Failed to update team group.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteGroup = async (group) => {
    if (!window.confirm(`Delete "${group.title}" and all its members? This cannot be undone.`)) {
      return;
    }

    try {
      setSaving(true);
      if (group.id.startsWith('default-')) {
        showNotification('Run supabase_team_tables.sql in Supabase to enable full team management.', 'error');
        return;
      }
      await deleteTeamGroup(group.id);
      showNotification('Team group deleted successfully!');
      loadTeamData();
    } catch (error) {
      showNotification(error.message || 'Failed to delete team group.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const moveGroup = async (group, direction) => {
    const index = teamData.groups.findIndex((item) => item.id === group.id);
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= teamData.groups.length) return;

    const otherGroup = teamData.groups[swapIndex];
    if (group.id.startsWith('default-') || otherGroup.id.startsWith('default-')) {
      showNotification('Run supabase_team_tables.sql in Supabase to enable reordering.', 'error');
      return;
    }

    try {
      setSaving(true);
      await Promise.all([
        updateTeamGroup(group.id, { display_order: otherGroup.display_order }),
        updateTeamGroup(otherGroup.id, { display_order: group.display_order })
      ]);
      loadTeamData();
    } catch (error) {
      showNotification(error.message || 'Failed to reorder team groups.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleAddMember = async (groupId) => {
    if (!memberForm.name.trim()) {
      showNotification('Please enter a member name.', 'error');
      return;
    }

    try {
      setSaving(true);
      const group = teamData.groups.find((item) => item.id === groupId);
      await createTeamMember({
        group_id: groupId,
        name: memberForm.name.trim(),
        photo_url: memberForm.photo_url.trim() || null,
        display_order: group?.members?.length || 0,
        image_object_position: memberForm.image_object_position
      });
      setAddingMemberGroupId(null);
      setMemberForm(emptyMemberForm);
      showNotification('Team member added successfully!');
      loadTeamData();
    } catch (error) {
      showNotification(error.message || 'Failed to add team member.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveMember = async () => {
    if (!memberForm.name.trim()) {
      showNotification('Please enter a member name.', 'error');
      return;
    }

    try {
      setSaving(true);
      await updateTeamMember(editingMemberId, {
        name: memberForm.name.trim(),
        photo_url: memberForm.photo_url.trim() || null,
        image_object_position: memberForm.image_object_position
      });
      setEditingMemberId(null);
      setMemberForm(emptyMemberForm);
      showNotification('Team member updated successfully!');
      loadTeamData();
    } catch (error) {
      showNotification(error.message || 'Failed to update team member.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMember = async (member) => {
    if (!window.confirm(`Delete ${member.name}? This cannot be undone.`)) {
      return;
    }

    try {
      setSaving(true);
      if (member.id.startsWith('wt-') || member.id.startsWith('sec-')) {
        showNotification('Run supabase_team_tables.sql in Supabase to enable full team management.', 'error');
        return;
      }
      await deleteTeamMember(member.id);
      showNotification('Team member deleted successfully!');
      loadTeamData();
    } catch (error) {
      showNotification(error.message || 'Failed to delete team member.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const moveMember = async (group, member, direction) => {
    const members = group.members || [];
    const index = members.findIndex((item) => item.id === member.id);
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= members.length) return;

    const otherMember = members[swapIndex];
    if (
      member.id.startsWith('wt-') ||
      member.id.startsWith('sec-') ||
      otherMember.id.startsWith('wt-') ||
      otherMember.id.startsWith('sec-')
    ) {
      showNotification('Run supabase_team_tables.sql in Supabase to enable reordering.', 'error');
      return;
    }

    try {
      setSaving(true);
      await Promise.all([
        updateTeamMember(member.id, { display_order: otherMember.display_order }),
        updateTeamMember(otherMember.id, { display_order: member.display_order })
      ]);
      loadTeamData();
    } catch (error) {
      showNotification(error.message || 'Failed to reorder team members.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (file, target) => {
    if (!file) return;

    try {
      setUploadingPhotoFor(target);
      const publicUrl = await uploadTeamPhoto(file);
      if (target === 'new') {
        setMemberForm((prev) => ({ ...prev, photo_url: publicUrl }));
      } else {
        setMemberForm((prev) => ({ ...prev, photo_url: publicUrl }));
      }
      showNotification('Photo uploaded successfully!');
    } catch (error) {
      showNotification(error.message || 'Failed to upload photo.', 'error');
    } finally {
      setUploadingPhotoFor(null);
    }
  };

  const startEditMember = (member) => {
    setEditingMemberId(member.id);
    setAddingMemberGroupId(null);
    setMemberForm({
      name: member.name,
      photo_url: member.photo_url || '',
      image_object_position: member.image_object_position || 'center'
    });
  };

  const startEditGroup = (group) => {
    setEditingGroupId(group.id);
    setEditingGroupTitle(group.title);
    setEditingGroupLayout(group.layout || 'compact');
  };

  const renderMemberForm = (onSave, onCancel, saveLabel) => (
    <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input
          type="text"
          value={memberForm.name}
          onChange={(e) => setMemberForm((prev) => ({ ...prev, name: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/40 focus:border-primary"
          placeholder="Full name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Photo URL</label>
        <input
          type="text"
          value={memberForm.photo_url}
          onChange={(e) => setMemberForm((prev) => ({ ...prev, photo_url: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/40 focus:border-primary"
          placeholder="/team/member-name.jpeg or uploaded URL"
        />
        <div className="mt-2 flex items-center gap-3">
          <label className="inline-flex items-center px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm cursor-pointer hover:bg-gray-50">
            {uploadingPhotoFor === 'form' ? 'Uploading...' : 'Upload Photo'}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={!!uploadingPhotoFor}
              onChange={(e) => handlePhotoUpload(e.target.files?.[0], 'form')}
            />
          </label>
          {memberForm.photo_url && (
            <img src={memberForm.photo_url} alt="Preview" className="w-12 h-12 rounded-full object-cover border" />
          )}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Photo Position</label>
        <select
          value={memberForm.image_object_position}
          onChange={(e) => setMemberForm((prev) => ({ ...prev, image_object_position: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/40 focus:border-primary"
        >
          <option value="center">Center</option>
          <option value="top">Top</option>
        </select>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-accent hover:text-primary transition-colors disabled:opacity-50"
        >
          {saveLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background/30 to-white py-12 md:py-20">
        <Notification message={notification.message} type={notification.type} />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-primary/10">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
              <div>
                <h1 className="text-4xl md:text-5xl font-black text-primary mb-2">Team Management</h1>
                <p className="text-text/70">Manage the Meet Our Team section on the About page.</p>
              </div>
              <Link
                to="/admin/dashboard"
                className="px-4 py-2 bg-white border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-12 text-accent">Loading team data...</div>
            ) : (
              <div className="space-y-10">
                <section className="p-6 rounded-2xl border border-gray-200 bg-gray-50/50">
                  <h2 className="text-2xl font-bold text-primary mb-4">Section Title</h2>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={sectionTitle}
                      onChange={(e) => setSectionTitle(e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/40 focus:border-primary"
                      placeholder="Meet Our Team"
                    />
                    <button
                      type="button"
                      onClick={handleSaveSectionTitle}
                      disabled={saving}
                      className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-accent hover:text-primary transition-colors disabled:opacity-50"
                    >
                      Save Title
                    </button>
                  </div>
                </section>

                <section className="p-6 rounded-2xl border border-gray-200">
                  <h2 className="text-2xl font-bold text-primary mb-4">Add Team Group</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={newGroupTitle}
                      onChange={(e) => setNewGroupTitle(e.target.value)}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/40 focus:border-primary"
                      placeholder="e.g. Coordination Team"
                    />
                    <select
                      value={newGroupLayout}
                      onChange={(e) => setNewGroupLayout(e.target.value)}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/40 focus:border-primary"
                    >
                      <option value="compact">Compact grid (many members)</option>
                      <option value="featured">Featured grid (fewer members)</option>
                    </select>
                    <button
                      type="button"
                      onClick={handleAddGroup}
                      disabled={saving}
                      className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-accent hover:text-primary transition-colors disabled:opacity-50"
                    >
                      Add Group
                    </button>
                  </div>
                </section>

                {teamData.groups.map((group, groupIndex) => (
                  <section key={group.id} className="p-6 rounded-2xl border border-gray-200">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                      {editingGroupId === group.id ? (
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={editingGroupTitle}
                            onChange={(e) => setEditingGroupTitle(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg"
                          />
                          <select
                            value={editingGroupLayout}
                            onChange={(e) => setEditingGroupLayout(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg"
                          >
                            <option value="compact">Compact grid</option>
                            <option value="featured">Featured grid</option>
                          </select>
                        </div>
                      ) : (
                        <div>
                          <h2 className="text-2xl font-bold text-primary">{group.title}</h2>
                          <p className="text-sm text-text/60 capitalize">{group.layout || 'compact'} layout</p>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => moveGroup(group, 'up')}
                          disabled={groupIndex === 0 || saving}
                          className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40"
                        >
                          Move Up
                        </button>
                        <button
                          type="button"
                          onClick={() => moveGroup(group, 'down')}
                          disabled={groupIndex === teamData.groups.length - 1 || saving}
                          className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40"
                        >
                          Move Down
                        </button>
                        {editingGroupId === group.id ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleSaveGroup(group.id)}
                              disabled={saving}
                              className="px-4 py-2 bg-primary text-white rounded-lg"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingGroupId(null)}
                              className="px-4 py-2 border border-gray-300 rounded-lg"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => startEditGroup(group)}
                              className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                            >
                              Edit Group
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteGroup(group)}
                              className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      {(group.members || []).map((member, memberIndex) => (
                        <div key={member.id} className="flex flex-col md:flex-row md:items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                          {member.photo_url ? (
                            <img
                              src={member.photo_url}
                              alt={member.name}
                              className="w-16 h-16 rounded-full object-cover border flex-shrink-0"
                              style={{ objectPosition: member.image_object_position === 'top' ? 'top' : 'center' }}
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-[#B6A8C1] flex items-center justify-center text-primary font-bold flex-shrink-0">
                              {member.name.split(' ').map((part) => part[0]).join('')}
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="font-semibold text-primary">{member.name}</p>
                            <p className="text-sm text-text/60 break-all">{member.photo_url || 'No photo URL'}</p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => moveMember(group, member, 'up')}
                              disabled={memberIndex === 0 || saving}
                              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-40"
                            >
                              Up
                            </button>
                            <button
                              type="button"
                              onClick={() => moveMember(group, member, 'down')}
                              disabled={memberIndex === group.members.length - 1 || saving}
                              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-40"
                            >
                              Down
                            </button>
                            <button
                              type="button"
                              onClick={() => startEditMember(member)}
                              className="px-3 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteMember(member)}
                              className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {editingMemberId && (group.members || []).some((member) => member.id === editingMemberId) &&
                      renderMemberForm(handleSaveMember, () => {
                        setEditingMemberId(null);
                        setMemberForm(emptyMemberForm);
                      }, 'Save Member')}

                    {addingMemberGroupId === group.id ? (
                      renderMemberForm(
                        () => handleAddMember(group.id),
                        () => {
                          setAddingMemberGroupId(null);
                          setMemberForm(emptyMemberForm);
                        },
                        'Add Member'
                      )
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setAddingMemberGroupId(group.id);
                          setEditingMemberId(null);
                          setMemberForm(emptyMemberForm);
                        }}
                        className="mt-4 px-4 py-2 bg-white border-2 border-dashed border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors"
                      >
                        + Add Member
                      </button>
                    )}

                    {groupIndex < teamData.groups.length - 1 && (
                      <div className="mt-8 border-t border-gray-200" />
                    )}
                  </section>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamManagement;
