import { useCopyToClipboard } from "@uidotdev/usehooks";
import useChannel from "context/ChannelContext";
import { Suspense, useState } from "react";
import { usePopper } from "react-popper";
import { RWebShare } from "react-web-share";

export default function ChannelInviteLink() {
  const [refElement, setRefElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const [showPopover, setShowPopover] = useState(false);
  const [, copyToClipboard] = useCopyToClipboard();
  const { channels, selectedChannel } = useChannel();
  const channel = channels[selectedChannel];

  const { styles, attributes } = usePopper(refElement, popperElement, {
    placement: "bottom",
  });
  const createInviteUrl = (url) =>
    `${process.env.REACT_APP_BASE_URL}?invite=${url}`;

  const handleCopy = async () => {
    copyToClipboard(createInviteUrl(channel.channel_invites[0].url));
    setShowPopover(true);
    setTimeout(() => {
      setShowPopover(false);
    }, 1500);
  };
  const handleShare = async () => {
    await navigator.share({
      url: createInviteUrl(channel.channel_invites[0].url),
    });
  };
  return (
    <div className="mb-6">
      <h2 className="text-2xl  font-semibold">Invite Link</h2>
      <div className="mt-3.5 relative">
        <input
          readOnly
          className="text-ellipsis overflow-hidden whitespace-nowrap w-full bg-neutral-700 rounded p-2 pr-14"
          value={createInviteUrl(channel?.channel_invites[0].url)}
        />
        <div className="absolute flex gap-2 top-0 right-2 h-full">
          <button ref={setRefElement} onClick={handleCopy} type="button">
            <i className="fa-solid fa-copy"></i>
          </button>
          {showPopover && (
            <div
              ref={setPopperElement}
              {...attributes.popper}
              style={styles.popper}
              className="rounded bg-neutral-800 shadow-md py-1 px-3 relative after:w-0 after:h-0 after:block after:border-transparent after:border-b-neutral-800 after:border-t-0 after:border-r-[6px] after:border-b-4 after:border-l-[6px] after:top-[-4px] after:left-[calc(50%-6px)] after:z-[1px] after:absolute"
            >
              Copied
            </div>
          )}
          <Suspense>
            <RWebShare
              data={{
                url: createInviteUrl(channel.channel_invites[0].url),
              }}
            >
              <button onClick={handleShare} type="button">
                <i className="fa-solid fa-share-nodes"></i>
              </button>
            </RWebShare>
          </Suspense>
        </div>
      </div>
    </div>
  );
}