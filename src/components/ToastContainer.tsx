import { React } from "@vendetta/metro/common";
import { Text, View, TouchableOpacity } from "@vendetta/ui/components";
import { TOS_INDICATOR } from "../utils/constants";

interface Props {
  violations: string[];
  messageId: string;
}

export function ToastContainer({ violations, messageId }: Props) {
  const [expanded, setExpanded] = React.useState(false);

  return React.createElement(
    View,
    {
      key: `tos-warn-${messageId}`,
      style: {
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
        marginBottom: 2,
      },
    },
    React.createElement(
      TouchableOpacity,
      {
        onPress: () => setExpanded((v) => !v),
        style: {
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "rgba(255, 165, 0, 0.15)",
          borderLeftWidth: 3,
          borderLeftColor: "#FFA500",
          borderRadius: 4,
          paddingHorizontal: 8,
          paddingVertical: 3,
          marginTop: 2,
        },
        accessibilityLabel: "Rule violation warning",
      },
      React.createElement(
        Text,
        {
          style: {
            fontSize: 12,
            color: "#FFA500",
            fontWeight: "600",
          },
        },
        `${TOS_INDICATOR} ${violations.length} rule violation${violations.length > 1 ? "s" : ""} detected ${expanded ? "▲" : "▼"}`
      )
    ),
    expanded &&
      React.createElement(
        View,
        {
          style: {
            width: "100%",
            backgroundColor: "rgba(255, 165, 0, 0.08)",
            borderRadius: 4,
            padding: 6,
            marginTop: 2,
          },
        },
        ...violations.map((v, i) =>
          React.createElement(
            Text,
            {
              key: `v-${i}`,
              style: {
                fontSize: 11,
                color: "#FFB732",
                marginBottom: i < violations.length - 1 ? 2 : 0,
              },
            },
            `• ${v}`
          )
        )
      )
  );
}
