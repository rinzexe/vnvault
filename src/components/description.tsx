import React, { useState } from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { cn } from "@/lib/utils/shadcn/utils";

interface ParsedToken {
  type: string;
  content: string;
  url?: string;
}

function parseStringToTokens(input: string): ParsedToken[] {
  const tokens: ParsedToken[] = [];

  const regex = /\[b\](.*?)\[\/b\]|\[i\](.*?)\[\/i\]|\[u\](.*?)\[\/u\]|\[s\](.*?)\[\/s\]|\[url=(.*?)\](.*?)\[\/url\]|\[quote\](.*?)\[\/quote\]|\[spoiler\](.*?)\[\/spoiler\]|\[code\](.*?)\[\/code\]|\b([cdprsuv]\d+(?:\.\d+)?)\b|(\S+)/gi;

  let match;
  while ((match = regex.exec(input)) !== null) {
    if (match[1]) tokens.push({ type: "bold", content: match[1] });
    else if (match[2]) tokens.push({ type: "italic", content: match[2] });
    else if (match[3]) tokens.push({ type: "underline", content: match[3] });
    else if (match[4]) tokens.push({ type: "strike", content: match[4] });
    else if (match[5] && match[6]) tokens.push({ type: "url", content: match[6], url: match[5] });
    else if (match[7]) tokens.push({ type: "quote", content: match[7] });
    else if (match[8]) tokens.push({ type: "spoiler", content: match[8] });
    else if (match[9]) tokens.push({ type: "code", content: match[9] });
    else if (match[10]) tokens.push({ type: "vndbid", content: match[10] });
    else tokens.push({ type: "text", content: match[11] });
  }

  return tokens;
}

function renderTokens(tokens: ParsedToken[]) {
  return tokens.map((token, index) => {
    switch (token.type) {
      case "bold":
        return <b key={index}>{token.content}</b>;
      case "italic":
        return <i key={index}>{token.content}</i>;
      case "underline":
        return <u key={index}>{token.content}</u>;
      case "strike":
        return <s key={index}>{token.content}</s>;
      case "url":
        return (
          <a key={index} className="text-accent" href={token.url} target="_blank" rel="noopener noreferrer">
            {token.content}
          </a>
        );
      case "quote":
        return <blockquote key={index}>{'"' + token.content + '"'}</blockquote>;
      case "spoiler":
        return <Spoiler key={index} content={token.content} />;
      case "code":
        return (
          <code key={index} style={{ fontFamily: "monospace", display: "block", whiteSpace: "pre" }}>
            {token.content}
          </code>
        );
      case "vndbid":
        return (
          <a key={index} href={`https://vndb.org/${token.content}`} target="_blank" rel="noopener noreferrer">
            {token.content}
          </a>
        );
      default:
        return <span key={index}>{token.content} </span>;
    }
  });
}

function Spoiler({ content }: { content: string }) {
  const [isRevealed, setIsRevealed] = useState(false);

  const handleClick = () => {
    setIsRevealed(!isRevealed);
  };

  return (
    <span
      onClick={handleClick}
      style={{
        backgroundColor: isRevealed ? "transparent" : "#000",
        color: isRevealed ? "inherit" : "#000",
        padding: "2px",
        cursor: "pointer",
      }}
    >
      {isRevealed ? content : "Spoiler: Click to reveal"}
    </span>
  );
}

export default function Description({ text }: { text: string }) {
  const tokens = parseStringToTokens(text);
  return <div>{renderTokens(tokens)}</div>;
}
