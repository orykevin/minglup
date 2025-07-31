import { Text } from "@react-email/components";
import { CustomButton, HTMLWrapper, PlaceHolder } from "./component";

export default function EmailInformedMinggle({
  invitedId,
  peopleLeft,
}: {
  invitedId: string;
  peopleLeft: number;
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
              Another person is confirmed
            </Text>
            <Text
              style={{ fontWeight: "bold", fontSize: "28px", marginTop: "4px" }}
            >
              {peopleLeft > 1
                ? `and there are ${peopleLeft} people left`
                : "you are the only person left"}
            </Text>
          </div>
        }
        img="https://pub-19ec6f30c4404c10bdc8b5ffc96f6505.r2.dev/info.png"
      >
        <CustomButton
          href={`${process.env.SITE_URL}/minggle-overview/${invitedId}`}
        >
          Confirm my spot
        </CustomButton>
      </PlaceHolder>
    </HTMLWrapper>
  );
}
