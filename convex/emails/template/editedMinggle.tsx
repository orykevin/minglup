import { CustomButton, HTMLWrapper, PlaceHolder } from "./component";

export default function EmailEditedMinggle({
  invitedId,
  minggleRef,
}: {
  invitedId: string;
  minggleRef: number;
}) {
  return (
    <HTMLWrapper>
      <PlaceHolder
        title={
          minggleRef > 1
            ? `Minggle event update #${minggleRef}`
            : "Minggle event updated"
        }
        img="https://pub-19ec6f30c4404c10bdc8b5ffc96f6505.r2.dev/marked.png"
      >
        <CustomButton
          href={`${process.env.SITE_URL}/minggle-overview/${invitedId}`}
        >
          See Updated Minggle
        </CustomButton>
      </PlaceHolder>
    </HTMLWrapper>
  );
}
