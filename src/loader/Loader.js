import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

function Loader() {
  return (
    <>
      <Button variant="primary" disabled>
        <Spinner
          as="span"
          animation="grow"
          size="sm"
          role="status"
          aria-hidden="true"
        />
        Loading...
      </Button>
    </>
  );
}

export default Loader;
