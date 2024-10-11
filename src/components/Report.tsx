import React from "react";
import { Col, Row, Container } from "reactstrap";

const Report: React.FC = () => {
  return (
    <Container fluid>
      <Row className="mb-3">
        <Col>
          <h1>MID-SEMESTER STUDENT EVALUATION</h1>
          <h2>PROGRESS REPORT</h2>
        </Col>
      </Row>
      <div className="report-specifics-container">
        <Row className="mb-2">
          <Col sm="6">
            <strong>Student:</strong>
          </Col>
          <Col sm="6">
            <strong>Date:</strong>
          </Col>
        </Row>
        <Row className="mb-2">
          <Col sm="6">
            <strong>Instructor:</strong>
          </Col>
          <Col sm="6">
            <strong>Semester:</strong>
          </Col>
        </Row>
        <Row className="mb-2">
          <Col>
            <strong>COURSE and DESCRIPTION:</strong>
          </Col>
        </Row>
        <Row className="mb-2">
          <Col>{/* {course.description} */}</Col>
        </Row>
        <Row className="mb-2">
          <Col>
            <strong>ATTENDANCE:</strong>
          </Col>
        </Row>
        <Row className="mb-2">
          <Col sm="6">
            <strong>GRADE IN PROGRESS:</strong>
          </Col>
          <Col sm="6">
            <strong>CREDITS POSSIBLE:</strong>
            <br />
            (please note if reduced due to attendance, etc.)
          </Col>
        </Row>
        <Row>
          <Col>
            <strong>COMMENTS:</strong>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default Report;
