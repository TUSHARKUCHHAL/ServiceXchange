import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaSearch, FaFilter, FaPlus, FaCalendarAlt, 
  FaUsers, FaEllipsisV, FaClock
} from 'react-icons/fa';
import './DashboardOverview';

const ProjectManagement = () => {
  const [projects, setProjects] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

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
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
  };

  const getFilteredProjects = () => {
    return projects.filter(project => {
      const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            project.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
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

  return (
    <div className="project-management">
      {/* Header with Search and Filters */}
      <div className="project-header">
        <button className="btn btn-primary">
          <FaPlus /> New Project
        </button>
        
        <div className="project-filters">
          <div className="form-group project-search">
            <div className="search-input">
              <FaSearch style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
              <input 
                type="text"
                className="form-control"
                placeholder="Search projects..."
                style={{ paddingLeft: '35px' }}
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>
          
          <div className="project-status">
            <div 
              className={`status-badge ${filterStatus === 'all' ? 'status-active' : ''}`}
              onClick={() => handleFilterChange('all')}
            >
              All
            </div>
            <div 
              className={`status-badge ${filterStatus === 'planned' ? 'status-planned' : ''}`}
              onClick={() => handleFilterChange('planned')}
            >
              Planned
            </div>
            <div 
              className={`status-badge ${filterStatus === 'active' ? 'status-active' : ''}`}
              onClick={() => handleFilterChange('active')}
            >
              Active
            </div>
            <div 
              className={`status-badge ${filterStatus === 'completed' ? 'status-completed' : ''}`}
              onClick={() => handleFilterChange('completed')}
            >
              Completed
            </div>
          </div>
          
          <button className="btn btn-outline">
            <FaFilter /> Filter
          </button>
        </div>
      </div>

      {/* Project Cards */}
      {isLoading ? (
        <div className="loading">Loading projects...</div>
      ) : (
        <motion.div 
          className="grid-container"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {getFilteredProjects().map((project) => (
            <motion.div 
              key={project.id} 
              className="card project-card"
              variants={childVariants}
            >
              <div className="project-card-header">
                <div>
                  <h3 className="card-title">{project.title}</h3>
                  <div className={getStatusBadgeClass(project.status)}>
                    {getStatusLabel(project.status)}
                  </div>
                </div>
                <div className="project-options">
                  <FaEllipsisV />
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
                  <div 
                    className="progress-fill"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default ProjectManagement;