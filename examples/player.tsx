import React from "react";
import AudioPlayer from "./audio-player";
import WaveformProvider, { InjectedWaveformProps } from "./waveform-provider";

function Player() {
  const [addedAudio, setAddedAudio] = useState<{
    file?: File | undefined;
    url?: string | undefined;
  } | null>(null);

  return (
    <WaveformProvider
      loaded={addedAudio}
      render={(props: InjectedWaveformProps) => <AudioPlayer {...props} />}
    />
  );
}

export default Player;
