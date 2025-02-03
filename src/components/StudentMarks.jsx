import React, { useEffect, useState } from 'react';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import { studentApi } from '../services/api';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';

export const StudentMarks = ({ studentId }) => {
  const [marks, setMarks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedMark, setSelectedMark] = useState(null);
  const [subjects, setSubjects] = useState([]);

  const [formData, setFormData] = useState({
    subject_id: '',
    score: '',
    exam_date: ''
  });

  useEffect(() => {
    fetchMarks();
    fetchSubjects();
  }, [studentId]);

  const fetchMarks = async () => {
    try {
      const response = await studentApi.getMarks(studentId);
      setMarks(response.data);
    } catch (error) {
      Swal.fire('Error', 'Failed to fetch marks', 'error');
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await studentApi.getSubjects();
      setSubjects(response.data);
    } catch (error) {
      Swal.fire('Error', 'Failed to fetch subjects', 'error');
    }
  };

  const handleAddMark = async (e) => {
    e.preventDefault();
    try {
      await studentApi.addMark(studentId, {
        subject_id: parseInt(formData.subject_id),
        score: parseFloat(formData.score),
        exam_date: formData.exam_date
      });
      setShowModal(false);
      fetchMarks();
      Swal.fire('Success', 'Mark added successfully', 'success');
    } catch (error) {
      Swal.fire('Error', 'Failed to add mark', 'error');
    }
  };

  const handleDelete = async (markId) => {
    try {
      await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!'
      }).then(async (result) => {
        if (result.isConfirmed) {
          await studentApi.deleteMark(studentId, markId);
          fetchMarks();
          Swal.fire('Deleted!', 'Mark has been deleted.', 'success');
        }
      });
    } catch (error) {
      Swal.fire('Error', 'Failed to delete mark', 'error');
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Student Marks</h3>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Add Mark
        </Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Subject</th>
            <th>Score</th>
            <th>Exam Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {marks.map((mark) => (
            <tr key={mark.id}>
              <td>{mark.subject_name}</td>
              <td>{mark.score}</td>
              <td>{new Date(mark.exam_date).toLocaleDateString()}</td>
              <td>
                <Button 
                  variant="danger" 
                  size="sm" 
                  onClick={() => handleDelete(mark.id)}
                >
                  <FaTrash /> Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Mark</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddMark}>
            <Form.Group className="mb-3">
              <Form.Label>Subject</Form.Label>
              <Form.Select
                value={formData.subject_id}
                onChange={(e) => setFormData({...formData, subject_id: e.target.value})}
                required
              >
                <option value="">Select Subject</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Score</Form.Label>
              <Form.Control
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.score}
                onChange={(e) => setFormData({...formData, score: e.target.value})}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Exam Date</Form.Label>
              <Form.Control
                type="date"
                value={formData.exam_date}
                onChange={(e) => setFormData({...formData, exam_date: e.target.value})}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Add Mark
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};