import { findByProps } from "@vendetta/metro";
import { after } from "@vendetta/patcher";
import { React } from "@vendetta/metro/common";
import { ToastContainer } from "./components/ToastContainer";
import { checkMessageForViolations } from "./utils/ruleChecker";
import { TOS_INDICATOR } from "./utils/constants";

let unpatch: (() => void) | null = null;

export default {
  onLoad() {
    const MessageRecord = findByProps("getMessage", "getMessages");

    // Patch message rendering to add ⚠️ indicator
    const MessageContent = findByProps("renderMessageContent", "MessageContent")
      ?? findByProps("default", "type", { where: (m: any) => m?.default?.displayName === "MessageContent" });

    const messageComponents = findByProps("ChannelMessage", "ThreadStarterChatMessage");

    if (messageComponents?.ChannelMessage) {
      unpatch = after("ChannelMessage", messageComponents, (args, res) => {
        const message = args?.[0]?.message ?? args?.[0]?.props?.message;
        if (!message?.content) return res;

        const violations = checkMessageForViolations(message.content);
        if (violations.length === 0) return res;

        // Inject the warning indicator into the message
        if (res?.props?.children) {
          const original = res.props.children;
          res.props.children = React.createElement(
            React.Fragment,
            null,
            React.createElement(ToastContainer, {
              violations,
              messageId: message.id,
            }),
            original
          );
        }

        return res;
      });
    } else {
      // Fallback: patch via message content util
      const MessageUtils = findByProps("renderMessageMarkupToAST");
      if (MessageUtils) {
        unpatch = after("renderMessageMarkupToAST", MessageUtils, (args, res) => {
          const content: string = args?.[0]?.content ?? "";
          if (!content) return res;

          const violations = checkMessageForViolations(content);
          if (violations.length === 0) return res;

          const warning = `\n\n${TOS_INDICATOR} **Rule violation detected:** ${violations.join("; ")}`;
          if (res?.content) {
            res.content = res.content + warning;
          }
          return res;
        });
      }
    }
  },

  onUnload() {
    unpatch?.();
    unpatch = null;
  },
};
