import {
  EmailShareButton,
  FacebookMessengerShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import {
  EmailIcon,
  FacebookIcon,
  FacebookMessengerIcon,
  LinkedinIcon,
  TelegramIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";

export const ShareTo = (data) => {
  const currentPageUrl = window.location.href;
  return (
    <div className="flex gap-1">
      <EmailShareButton url={currentPageUrl}>
        <EmailIcon size={32} round={true} className=" hover:scale-[1.1]" />
      </EmailShareButton>
      <FacebookShareButton url={currentPageUrl} className=" hover:scale-[1.1]">
        <FacebookIcon size={32} round={true} />
      </FacebookShareButton>
      <FacebookMessengerShareButton
        url={currentPageUrl}
        className=" hover:scale-[1.1]"
      >
        <FacebookMessengerIcon size={32} round={true} />
      </FacebookMessengerShareButton>
      <LinkedinShareButton url={currentPageUrl} className=" hover:scale-[1.1]">
        <LinkedinIcon size={32} round={true} />
      </LinkedinShareButton>
      <TelegramShareButton url={currentPageUrl} className=" hover:scale-[1.1]">
        <TelegramIcon size={32} round={true} />
      </TelegramShareButton>

      <TwitterShareButton url={currentPageUrl} className=" hover:scale-[1.1]">
        <TwitterIcon size={32} round={true} />
      </TwitterShareButton>
      <WhatsappShareButton url={currentPageUrl} className=" hover:scale-[1.1]">
        <WhatsappIcon size={32} round={true} />
      </WhatsappShareButton>
    </div>
  );
};
