import React, { useEffect, useState } from 'react';
import { Table, Button, Pagination } from 'react-bootstrap';
import { FaEdit, FaTrash, FaGraduationCap } from 'react-icons/fa';
import { studentApi } from '../services/api';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pageLimit] = useState(10); // Items per page
  const navigate = useNavigate();

  const fetchStudents = async (page) => {
    try {
      setLoading(true);
      const response = await studentApi.getAll(page, pageLimit);
      setStudents(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (error) {
      Swal.fire('Error', 'Failed to fetch students', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        await studentApi.delete(id);
        Swal.fire('Deleted!', 'Student has been deleted.', 'success');
        // If we're on a page with only one item and it's not the first page,
        // go to previous page after deletion
        if (students.length === 1 && currentPage > 1) {
          setCurrentPage(prev => prev - 1);
        } else {
          fetchStudents(currentPage);
        }
      }
    } catch (error) {
      Swal.fire('Error', 'Failed to delete student', 'error');
    }
  };

  useEffect(() => {
    fetchStudents(currentPage);
  }, [currentPage]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <h2>Students List</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Date of Birth</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{`${student.first_name} ${student.last_name}`}</td>
              <td>{student.email}</td>
              <td>{new Date(student.date_of_birth).toLocaleDateString()}</td>
              <td>
                <Button 
                  variant="primary" 
                  size="sm" 
                  className="me-2"
                  onClick={() => navigate(`/students/edit/${student.id}`)}
                >
                  <FaEdit /> Edit
                </Button>
                <Button 
                  variant="danger" 
                  size="sm" 
                  className="me-2" 
                  onClick={() => handleDelete(student.id)}
                >
                  <FaTrash /> Delete
                </Button>
                <Button 
                  variant="info" 
                  size="sm"
                  onClick={() => navigate(`/students/${student.id}`)}
                >
                  <FaGraduationCap /> Marks
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {totalPages > 1 && (
        <Pagination className="justify-content-center">
          <Pagination.First 
            onClick={() => setCurrentPage(1)} 
            disabled={currentPage === 1}
          />
          <Pagination.Prev 
            onClick={() => setCurrentPage(prev => prev - 1)} 
            disabled={currentPage === 1}
          />
          
          {[...Array(totalPages)].map((_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
          
          <Pagination.Next 
            onClick={() => setCurrentPage(prev => prev + 1)} 
            disabled={currentPage === totalPages}
          />
          <Pagination.Last 
            onClick={() => setCurrentPage(totalPages)} 
            disabled={currentPage === totalPages}
          />
        </Pagination>
      )}
    </div>
  );
};

export default StudentList;