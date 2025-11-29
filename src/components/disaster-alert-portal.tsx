import { Button } from "./ui/button";

const DisasterAlertPortal = () => {
  const handleClick = () => {
    window.open("https://sachet.ndma.gov.in/", "_blank"); // opens in a new tab
  };

  return (
    <Button onClick={handleClick}>
      View Disaster Alerts
    </Button>
  );
};

export default DisasterAlertPortal;
