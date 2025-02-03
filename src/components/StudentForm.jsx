import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { studentApi } from '../services/api';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';

export const StudentForm = ({ isEdit }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  const initialFormState = {
    first_name: '',
    last_name: '',
    email: '',
    date_of_birth: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (isEdit && id) {
      fetchStudentData();
    } else {
      setLoading(false);
    }
  }, [isEdit, id]);

  const fetchStudentData = async () => {
    try {
      const response = await studentApi.getById(parseInt(id));
      const formattedDate = response.data.date_of_birth 
        ? new Date(response.data.date_of_birth).toISOString().split('T')[0]
        : '';
        
      setFormData({
        first_name: response.data.first_name,
        last_name: response.data.last_name,
        email: response.data.email,
        date_of_birth: formattedDate
      });
    } catch (error) {
      Swal.fire('Error', 'Failed to fetch student data', 'error');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit && id) {
        await studentApi.update(parseInt(id), formData);
        await Swal.fire('Success', 'Student updated successfully', 'success');
        navigate('/');
      } else {
        await studentApi.create(formData);
        await Swal.fire('Success', 'Student created successfully', 'success');
        setFormData(initialFormState);
      }
    } catch (error) {
      Swal.fire('Error', 'Failed to save student', 'error');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{isEdit ? 'Edit Student' : 'Create New Student'}</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            value={formData.last_name}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Date of Birth</Form.Label>
          <Form.Control
            type="date"
            value={formData.date_of_birth}
            onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          {isEdit ? 'Update' : 'Create'} Student
        </Button>
      </Form>
    </div>
  );
};