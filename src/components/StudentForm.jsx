import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { studentApi } from '../services/api';
import Swal from 'sweetalert2';

export const StudentForm = ({ onSubmit, student, isEdit }) => {
  const [formData, setFormData] = useState({
    first_name: student?.first_name || '',
    last_name: student?.last_name || '',
    email: student?.email || '',
    date_of_birth: student?.date_of_birth || ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit && student) {
        await studentApi.update(student.id, formData);
        Swal.fire('Success', 'Student updated successfully', 'success');
      } else {
        await studentApi.create(formData);
        Swal.fire('Success', 'Student created successfully', 'success');
      }
      if (onSubmit) onSubmit();
    } catch (error) {
      Swal.fire('Error', 'Failed to save student', 'error');
    }
  };

  return (
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
  );
};