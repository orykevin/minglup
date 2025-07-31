import { Text } from "@react-email/components";
import { CustomButton, HTMLWrapper, PlaceHolder } from "./component";

export default function EmailConfirmedMinggle({
  invitedId,
  rank,
}: {
  invitedId: string;
  rank: number;
}) {
  return (
    <HTMLWrapper>
      <PlaceHolder
        title={
          <div>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: "28px",
                marginBottom: "4px",
              }}
            >
              You're Confirmed!
            </Text>
            <Text
              style={{ fontWeight: "bold", fontSize: "28px", marginTop: "4px" }}
            >
              and you are #{rank}
            </Text>
          </div>
        }
        img="https://pub-19ec6f30c4404c10bdc8b5ffc96f6505.r2.dev/confetti.png"
      >
        <CustomButton
          href={`${process.env.SITE_URL}/minggle-overview/${invitedId}`}
        >
          See minggle details
        </CustomButton>
      </PlaceHolder>
    </HTMLWrapper>
  );
}
