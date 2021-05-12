import React from "react";
import styled from "styled-components";
import { PAUSE_AUDIO, PLAY_AUDIO } from "assets/icons/audio-player";
import { InjectedWaveformProps } from "./waveform-provider";

type CustomProps = {
  isActive: boolean;
};

type TProps = InjectedWaveformProps & {
  updateMainState?: React.Dispatch<
    React.SetStateAction<{
      file?: File | undefined;
      url?: string | undefined;
    } | null>
  >;
  isDownloaded?: true;
  isDeleted?: true;
  customStyles?: React.CSSProperties;
};

const AudioPlayer: React.FC<TProps> = (props) => {
  const {
    downloadLink,
    handlePlay,
    isTrackPlaying,
    isStartPlaying,
    downloadFileName,
    waveform,
    updateMainState,
    waveRef,
    isDownloaded,
    isDeleted,
    customStyles,
  } = props;

  return (
    <WaveformContianer ref={waveRef} style={customStyles}>
      <PlayButton type="button" isActive={isStartPlaying}>
        {isTrackPlaying() ? (
          <PAUSE_AUDIO onClick={handlePlay} />
        ) : (
          <PLAY_AUDIO onClick={handlePlay} />
        )}
      </PlayButton>
      {isDownloaded && (
        <DownloadButton
          href={downloadLink}
          target="_blank"
          download={downloadFileName}
        >
          <img src={"download"} alt="Download" />
        </DownloadButton>
      )}
      {isDeleted && (
        <RemoveButton
          type="button"
          onClick={() => {
            waveform?.destroy();
            // eslint-disable-next-line no-unused-expressions
            updateMainState && updateMainState(null);
          }}
        >
          <img src={"delete icon"} alt="Remove" />
        </RemoveButton>
      )}
    </WaveformContianer>
  );
};

const DownloadButton = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  outline: none;
  cursor: pointer;
  order: 3;
`;

const RemoveButton = styled.button`
  display: flex;
  order: 4;
  justify-content: center;
  align-items: center;
  border: none;
  outline: none;
  cursor: pointer;
  background: transparent;
`;

const WaveformContianer = styled.div`
  display: flex;
  padding: 11px 13px;
  background-color: rgba(201, 201, 218, 0.3);
  border-radius: 10px;
  align-items: center;
  height: 52px;

  wave {
    width: 100%;
    height: 20px;
    order: 2;
  }
`;

export const PlayButton = styled.button<CustomProps>`
  display: flex;
  order: 1;
  justify-content: center;
  align-items: center;
  width: 40px;
  border-radius: 50%;
  border: none;
  outline: none;
  cursor: pointer;
  background-color: transparent;

  svg {
    path {
      fill: ${({ isActive }) =>
        isActive ? colors.BLUE.PRIMARY : colors.GREY.w3};
    }
  }
`;

export default AudioPlayer;
