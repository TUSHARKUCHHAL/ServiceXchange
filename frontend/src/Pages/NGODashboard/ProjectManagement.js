import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaSearch, FaFilter, FaPlus, FaCalendarAlt, 
  FaUsers, FaEllipsisV, FaClock, FaTimes, 
  FaEdit, FaTrash, FaCheck, FaSortAmountDown, FaSortAmountUp
} from 'react-icons/fa';
import './ProjectManagement.css';

const ProjectManagement = () => {
  const [projects, setProjects] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(null);
  const [sortOption, setSortOption] = useState({ field: 'startDate', direction: 'asc' });
  const [editingProject, setEditingProject] = useState(null);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    status: 'planned',
    startDate: '',
    endDate: '',
    volunteers: 0,
    progress: 0,
    location: ''
  });

  useEffect(() => {
    // Simulate loading data
    setIsLoading(true);
    const timer = setTimeout(() => {
      const dummyProjects = [
        {
          id: 1,
          title: "Food Distribution Drive",
          description: "Distribute food packets to underprivileged communities",
          status: "active",
          startDate: "2025-03-15",
          endDate: "2025-04-20",
          volunteers: 12,
          progress: 65,
          location: "Riverside Community"
        },
        {
          id: 2,
          title: "Beach Cleanup Drive",
          description: "Clean up the city beach and surrounding areas",
          status: "completed",
          startDate: "2025-02-10",
          endDate: "2025-02-28",
          volunteers: 25,
          progress: 100,
          location: "City Beach"
        },
        {
          id: 3,
          title: "Health Awareness Camp",
          description: "Free health checkups and awareness sessions",
          status: "planned",
          startDate: "2025-05-05",
          endDate: "2025-05-10",
          volunteers: 8,
          progress: 20,
          location: "Downtown Community Hall"
        },
        {
          id: 4,
          title: "Education Support Program",
          description: "Provide educational materials and mentoring",
          status: "active",
          startDate: "2025-01-15",
          endDate: "2025-06-30",
          volunteers: 15,
          progress: 45,
          location: "Various Schools"
        }
      ];
      
      setProjects(dummyProjects);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Close modals when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showOptionsMenu && !e.target.closest('.project-options') && !e.target.closest('.options-menu')) {
        setShowOptionsMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showOptionsMenu]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
  };

  const handleSort = (field) => {
    setSortOption(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const toggleFilterModal = () => {
    setShowFilterModal(!showFilterModal);
  };

  const toggleNewProjectModal = () => {
    if (showNewProjectModal && !editingProject) {
      // Reset form when closing without editing
      setNewProject({
        title: '',
        description: '',
        status: 'planned',
        startDate: '',
        endDate: '',
        volunteers: 0,
        progress: 0,
        location: ''
      });
    }
    setShowNewProjectModal(!showNewProjectModal);
  };

  const toggleOptionsMenu = (projectId) => {
    setShowOptionsMenu(prev => prev === projectId ? null : projectId);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject(prev => ({
      ...prev,
      [name]: name === 'volunteers' || name === 'progress' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmitProject = (e) => {
    e.preventDefault();
    
    if (editingProject) {
      // Update existing project
      setProjects(prev => prev.map(project => 
        project.id === editingProject ? { ...newProject, id: editingProject } : project
      ));
      setEditingProject(null);
    } else {
      // Add new project
      const newId = Math.max(...projects.map(p => p.id), 0) + 1;
      setProjects(prev => [...prev, { ...newProject, id: newId }]);
    }
    
    // Reset and close modal
    toggleNewProjectModal();
    setNewProject({
      title: '',
      description: '',
      status: 'planned',
      startDate: '',
      endDate: '',
      volunteers: 0,
      progress: 0,
      location: ''
    });
  };

  const handleEditProject = (project) => {
    setNewProject({ ...project });
    setEditingProject(project.id);
    setShowNewProjectModal(true);
    setShowOptionsMenu(null);
  };

  const handleDeleteProject = (projectId) => {
    setProjects(prev => prev.filter(project => project.id !== projectId));
    setShowOptionsMenu(null);
  };

  const getFilteredAndSortedProjects = () => {
    const filtered = projects.filter(project => {
      const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            project.location.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });

    return filtered.sort((a, b) => {
      let valA, valB;
      
      // Extract the values to compare based on the sort field
      switch (sortOption.field) {
        case 'title':
          valA = a.title.toLowerCase();
          valB = b.title.toLowerCase();
          break;
        case 'startDate':
          valA = new Date(a.startDate).getTime();
          valB = new Date(b.startDate).getTime();
          break;
        case 'endDate':
          valA = new Date(a.endDate).getTime();
          valB = new Date(b.endDate).getTime();
          break;
        case 'progress':
          valA = a.progress;
          valB = b.progress;
          break;
        case 'volunteers':
          valA = a.volunteers;
          valB = b.volunteers;
          break;
        default:
          valA = a[sortOption.field];
          valB = b[sortOption.field];
      }

      // Perform the comparison
      if (sortOption.direction === 'asc') {
        return valA > valB ? 1 : -1;
      } else {
        return valA < valB ? 1 : -1;
      }
    });
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'planned': return 'status-badge status-planned';
      case 'active': return 'status-badge status-active';
      case 'completed': return 'status-badge status-completed';
      default: return 'status-badge';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'planned': return 'Planned';
      case 'active': return 'Active';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      } 
    }
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 500
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 500
      }
    }
  };

  const getSortIcon = (field) => {
    if (sortOption.field !== field) return null;
    return sortOption.direction === 'asc' ? <FaSortAmountUp className="sort-icon" /> : <FaSortAmountDown className="sort-icon" />;
  };

  const filteredProjects = getFilteredAndSortedProjects();

  return (
    <div className="project-management">
      {/* Header with Search and Filters */}
      <div className="project-header">
        <button 
          className="btn btn-primary" 
          onClick={toggleNewProjectModal}
        >
          <FaPlus /> New Project
        </button>
        
        <div className="project-filters">
          <div className="form-group project-search">
            <div className="search-input">
              <FaSearch className="search-icon" />
              <input 
                type="text"
                className="form-control"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={handleSearch}
              />
              {searchTerm && (
                <FaTimes 
                  className="clear-search" 
                  onClick={() => setSearchTerm('')}
                />
              )}
            </div>
          </div>
          
          <div className="project-status">
            <div 
              className={`status-badge ${filterStatus === 'all' ? 'status-selected' : ''}`}
              onClick={() => handleFilterChange('all')}
            >
              All
            </div>
            <div 
              className={`status-badge status-planned ${filterStatus === 'planned' ? 'status-selected' : ''}`}
              onClick={() => handleFilterChange('planned')}
            >
              Planned
            </div>
            <div 
              className={`status-badge status-active ${filterStatus === 'active' ? 'status-selected' : ''}`}
              onClick={() => handleFilterChange('active')}
            >
              Active
            </div>
            <div 
              className={`status-badge status-completed ${filterStatus === 'completed' ? 'status-selected' : ''}`}
              onClick={() => handleFilterChange('completed')}
            >
              Completed
            </div>
          </div>
          
          <button 
            className="btn btn-outline" 
            onClick={toggleFilterModal}
          >
            <FaFilter /> Filter
          </button>
        </div>
      </div>

      {/* Project Stats */}
      <div className="project-stats">
        <div className="stat-card">
          <div className="stat-icon stat-total">
            <FaCalendarAlt />
          </div>
          <div className="stat-content">
            <h4>{projects.length}</h4>
            <p>Total Projects</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-active">
            <FaClock />
          </div>
          <div className="stat-content">
            <h4>{projects.filter(p => p.status === 'active').length}</h4>
            <p>Active Projects</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-completed">
            <FaCheck />
          </div>
          <div className="stat-content">
            <h4>{projects.filter(p => p.status === 'completed').length}</h4>
            <p>Completed</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-volunteers">
            <FaUsers />
          </div>
          <div className="stat-content">
            <h4>{projects.reduce((sum, p) => sum + p.volunteers, 0)}</h4>
            <p>Total Volunteers</p>
          </div>
        </div>
      </div>

      {/* Sort Controls */}
      <div className="sort-controls">
        <h3>Projects ({filteredProjects.length})</h3>
        <div className="sort-options">
          <span>Sort by:</span>
          <div 
            className={`sort-option ${sortOption.field === 'startDate' ? 'active' : ''}`}
            onClick={() => handleSort('startDate')}
          >
            Date {sortOption.field === 'startDate' && (
              sortOption.direction === 'asc' ? <FaSortAmountUp className="sort-icon" /> : <FaSortAmountDown className="sort-icon" />
            )}
          </div>
          <div 
            className={`sort-option ${sortOption.field === 'title' ? 'active' : ''}`}
            onClick={() => handleSort('title')}
          >
            Name {sortOption.field === 'title' && (
              sortOption.direction === 'asc' ? <FaSortAmountUp className="sort-icon" /> : <FaSortAmountDown className="sort-icon" />
            )}
          </div>
          <div 
            className={`sort-option ${sortOption.field === 'progress' ? 'active' : ''}`}
            onClick={() => handleSort('progress')}
          >
            Progress {sortOption.field === 'progress' && (
              sortOption.direction === 'asc' ? <FaSortAmountUp className="sort-icon" /> : <FaSortAmountDown className="sort-icon" />
            )}
          </div>
        </div>
      </div>

      {/* Project Cards */}
      {isLoading ? (
        <div className="loading">
          <div className="loader"></div>
          <p>Loading projects...</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="no-results">
          <FaSearch size={48} />
          <h3>No projects found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      ) : (
        <motion.div 
          className="grid-container"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredProjects.map((project) => (
            <motion.div 
              key={project.id} 
              className="card project-card"
              variants={childVariants}
              layoutId={`project-card-${project.id}`}
            >
              <div className="project-card-header">
                <div>
                  <h3 className="card-title">{project.title}</h3>
                  <div className={getStatusBadgeClass(project.status)}>
                    {getStatusLabel(project.status)}
                  </div>
                </div>
                <div 
                  className="project-options"
                  onClick={() => toggleOptionsMenu(project.id)}
                >
                  <FaEllipsisV />
                  
                  {showOptionsMenu === project.id && (
                    <div className="options-menu">
                      <div 
                        className="option" 
                        onClick={() => handleEditProject(project)}
                      >
                        <FaEdit /> Edit
                      </div>
                      <div 
                        className="option option-delete" 
                        onClick={() => handleDeleteProject(project.id)}
                      >
                        <FaTrash /> Delete
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <p className="project-description">
                {project.description}
              </p>
              
              <div className="project-meta">
                <div className="meta-item">
                  <FaCalendarAlt />
                  <span>{formatDate(project.startDate)} - {formatDate(project.endDate)}</span>
                </div>
                <div className="meta-item">
                  <FaUsers />
                  <span>{project.volunteers} Volunteers</span>
                </div>
                <div className="meta-item">
                  <FaClock />
                  <span>{project.location}</span>
                </div>
              </div>
              
              <div className="progress-container">
                <div className="progress-info">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="progress-bar">
                  <motion.div 
                    className="progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${project.progress}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  ></motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* New Project Modal */}
      <AnimatePresence>
        {showNewProjectModal && (
          <div className="modal-backdrop">
            <motion.div 
              className="modal"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>{editingProject ? 'Edit Project' : 'New Project'}</h2>
                <button className="close-btn" onClick={toggleNewProjectModal}>
                  <FaTimes />
                </button>
              </div>
              
              <form onSubmit={handleSubmitProject}>
                <div className="form-group">
                  <label htmlFor="title">Project Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={newProject.title}
                    onChange={handleInputChange}
                    placeholder="Enter project title"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={newProject.description}
                    onChange={handleInputChange}
                    placeholder="Project description"
                    required
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="status">Status</label>
                    <select
                      id="status"
                      name="status"
                      value={newProject.status}
                      onChange={handleInputChange}
                    >
                      <option value="planned">Planned</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="location">Location</label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={newProject.location}
                      onChange={handleInputChange}
                      placeholder="Project location"
                      required
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="startDate">Start Date</label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={newProject.startDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="endDate">End Date</label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={newProject.endDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="volunteers">Volunteers</label>
                    <input
                      type="number"
                      id="volunteers"
                      name="volunteers"
                      value={newProject.volunteers}
                      onChange={handleInputChange}
                      min="0"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="progress">Progress (%)</label>
                    <input
                      type="range"
                      id="progress"
                      name="progress"
                      value={newProject.progress}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                      className="progress-slider"
                    />
                    <span className="progress-value">{newProject.progress}%</span>
                  </div>
                </div>
                
                <div className="modal-actions">
                  <button 
                    type="button" 
                    className="btn btn-outline" 
                    onClick={toggleNewProjectModal}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingProject ? 'Update Project' : 'Create Project'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Advanced Filter Modal */}
      <AnimatePresence>
        {showFilterModal && (
          <div className="modal-backdrop" onClick={toggleFilterModal}>
            <motion.div 
              className="modal filter-modal"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>Advanced Filters</h2>
                <button className="close-btn" onClick={toggleFilterModal}>
                  <FaTimes />
                </button>
              </div>
              
              <div className="filter-sections">
                <div className="filter-section">
                  <h3>Status</h3>
                  <div className="filter-checkboxes">
                    <label className="checkbox-label">
                      <input 
                        type="checkbox" 
                        checked={filterStatus === 'all' || filterStatus === 'planned'} 
                        onChange={() => handleFilterChange('planned')}
                      />
                      <span className="checkbox-custom"></span>
                      Planned
                    </label>
                    <label className="checkbox-label">
                      <input 
                        type="checkbox" 
                        checked={filterStatus === 'all' || filterStatus === 'active'} 
                        onChange={() => handleFilterChange('active')}
                      />
                      <span className="checkbox-custom"></span>
                      Active
                    </label>
                    <label className="checkbox-label">
                      <input 
                        type="checkbox" 
                        checked={filterStatus === 'all' || filterStatus === 'completed'} 
                        onChange={() => handleFilterChange('completed')}
                      />
                      <span className="checkbox-custom"></span>
                      Completed
                    </label>
                  </div>
                </div>
                
                <div className="filter-section">
                  <h3>Progress</h3>
                  <div className="progress-range">
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value="0" 
                      className="range-slider"
                    />
                    <div className="range-labels">
                      <span>0%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>
                
                <div className="filter-section">
                  <h3>Date Range</h3>
                  <div className="date-inputs">
                    <div className="form-group">
                      <label>From</label>
                      <input type="date" />
                    </div>
                    <div className="form-group">
                      <label>To</label>
                      <input type="date" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="modal-actions">
                <button 
                  className="btn btn-outline" 
                  onClick={() => {
                    handleFilterChange('all');
                    toggleFilterModal();
                  }}
                >
                  Reset Filters
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={toggleFilterModal}
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectManagement;