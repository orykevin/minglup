import {
  Button,
  Html,
  Head,
  Font,
  Body,
  Column,
  Row,
  Img,
  Text,
  Container,
  Heading,
} from "@react-email/components";

export const PRIMARY_COLOR = "#198CD8";
export const FOREGROUND_COLOR = "#0a0a0a";
export const BACKGROUND_COLOR = "#fff";

export const HTMLWrapper = ({
  children,
  withLogo = true,
}: {
  children: React.ReactNode;
  withLogo?: boolean;
}) => (
  <Html
    lang="en"
    style={{ background: BACKGROUND_COLOR, color: FOREGROUND_COLOR }}
  >
    <Head>
      <Font fontFamily="Roboto, sans-serif" fallbackFontFamily="Arial" />
    </Head>
    <Body
      style={{
        padding: "2rem 1rem",
        margin: "0 auto",
        maxWidth: "600px",
      }}
    >
      {withLogo && <Logo />}
      {children}
    </Body>
  </Html>
);

export const Logo = () => (
  <div
    style={{
      marginBottom: "12px",
      display: "flex",
    }}
  >
    <Img
      src="https://pub-19ec6f30c4404c10bdc8b5ffc96f6505.r2.dev/logo.png"
      alt="logo"
      width="40"
      height="40"
    />
    <Text style={{ fontSize: "18px", fontWeight: "bold", margin: "6px" }}>
      MinglUp
    </Text>
  </div>
);

export const PlaceHolder = ({
  children,
  title,
  description,
  img,
}: {
  children: React.ReactNode;
  title: string | React.ReactNode;
  description?: string;
  img?: string;
}) => {
  return (
    <Container style={{ width: "max-content" }}>
      <Heading
        style={{ textAlign: "center", marginBottom: "8px", fontWeight: 600 }}
      >
        {title}
      </Heading>
      {description && (
        <Text
          style={{
            fontSize: "16px",
            textAlign: "center",
            marginTop: "0px",
            color: "#494949",
          }}
        >
          {description}
        </Text>
      )}
      {img && (
        <Img
          src={img}
          width="300px"
          style={{
            padding: "0 12px",
            marginBottom: "-2px",
            position: "relative",
            zIndex: -1,
          }}
        />
      )}
      {children}
    </Container>
  );
};

export const CustomButton = ({
  href,
  children,
  style,
}: {
  href: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) => (
  <a
    href={href}
    style={{
      background: PRIMARY_COLOR,
      color: BACKGROUND_COLOR,
      padding: "12px 20px",
      borderRadius: "24px",
      display: "inline-block",
      fontWeight: "bold",
      textAlign: "center",
      width: "90%",
      ...style,
    }}
  >
    {children}
  </a>
);
