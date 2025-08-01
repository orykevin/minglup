import { CustomButton, HTMLWrapper, PlaceHolder } from "./component";

export default function EmailCancelledMinggle({
  invitedId,
}: {
  invitedId: string;
}) {
  return (
    <HTMLWrapper>
      <PlaceHolder
        title="Minggle event cancelled"
        img="https://pub-19ec6f30c4404c10bdc8b5ffc96f6505.r2.dev/cancelled-1.png"
      >
        <CustomButton
          href={`http://localhost:3000/minggle-overview/${invitedId}`}
        >
          See Minggle event
        </CustomButton>
      </PlaceHolder>
    </HTMLWrapper>
  );
}
