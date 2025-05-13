import React, { useEffect } from "react";
import { Container, Card, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { AppState } from "../../store";
import { fetchStatusByIdAction } from "../../redux/status/statusActions";
import NotFoundComponent from "../../components/NotFoundComponent";
import { useCommonHooks } from "../../hooks/useCommonHooks";
import WithLoadingAndError from "../../components/WithLoadingAndError";

const StatusDetails: React.FC = () => {
  const {
    dispatch,
    navigate,
    params: { id },
  } = useCommonHooks();

  const { statuses, loading, error } = useSelector(
    (state: AppState) => state.statuses
  );
  const status = statuses.length > 0 ? statuses[0] : null;

  useEffect(() => {
    if (id) {
      dispatch(fetchStatusByIdAction(id));
    }
  }, [dispatch, id]);

  return (
    <WithLoadingAndError loading={loading} error={error}>
      {status ? (
        <Container
          style={{ maxWidth: "50rem", margin: "0 auto", textAlign: "center" }}
        >
          <Card className="mt-4">
            <Card.Body>
              <Card.Title>Status Details</Card.Title>
              <Card.Text>
                <strong>Description:</strong> {status.description}
              </Card.Text>
            </Card.Body>
          </Card>
          <div
            className="d-flex justify-content-start mt-2"
            style={{ gap: "1rem" }}
          >
            <Button
              variant="secondary"
              size="lg"
              style={{ maxWidth: "10rem" }}
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>
            <Button
              variant="primary"
              size="lg"
              style={{ maxWidth: "10rem" }}
              onClick={() => navigate(`/statuses/${id}/edit`)}
            >
              Edit
            </Button>
          </div>
        </Container>
      ) : (
        <NotFoundComponent message="Status not found." />
      )}
    </WithLoadingAndError>
  );
};

export default StatusDetails;
