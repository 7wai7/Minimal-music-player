export default function getAudioDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const audio = document.createElement("audio");
    audio.src = URL.createObjectURL(file);

    audio.addEventListener("loadedmetadata", () => {
      resolve(audio.duration); // у секундах
      URL.revokeObjectURL(audio.src); // чистимо за собою
    });

    audio.addEventListener("error", (e) => reject(e));
  });
}
