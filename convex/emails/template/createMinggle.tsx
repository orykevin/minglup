import { Button, Html, Heading } from "@react-email/components";

export default function EmailCreateMinggle() {
  return (
    <Html>
      <Heading>MinglUp</Heading>
      <Button
        href="https://google.com"
        style={{ background: "#000", color: "#fff", padding: "12px 20px" }}
      >
        Click mes
      </Button>
    </Html>
  );
}
