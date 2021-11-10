const signale = require("signale");
const { StreamType } = require("@discordjs/voice");
const { createAudioResource } = require("@discordjs/voice");
const { MessageEmbed } = require("discord.js");
const { AudioPlayerStatus } = require("@discordjs/voice");
const { entersState } = require("@discordjs/voice");
const { VoiceConnectionDisconnectReason } = require("@discordjs/voice");
const { VoiceConnectionStatus } = require("@discordjs/voice");
const { createAudioPlayer } = require("@discordjs/voice");
const ytdl = require("ytdl-core");
const { setTimeout } = require("timers");
const { promisify } = require("util");
const wait = promisify(setTimeout);

class MusicPlayer {
  constructor() {
    this.connection = null;
    this.audioPlayer = createAudioPlayer();
    this.queue = [];
    this.volume = 1;
  }

  passConnection(connection) {
    this.connection = connection;

    this.connection.on("stateChange", async (_, newState) => {
      switch (newState.status) {
        case VoiceConnectionStatus.Disconnected:
          if (newState.reason === VoiceConnectionDisconnectReason.WebSocketClose && newState.closeCode === 4014) {
            try {
              await entersState(this.connection, VoiceConnectionStatus.Connecting, 5000);
            } catch {
              this.connection.destroy();
            }
          } else if (this.connection.rejoinAttempts < 5) {
            await wait((this.connection.rejoinAttempts + 5) * 5000);
            this.connection.rejoin();
          } else {
            this.connection.destroy();
          }
          break;
        case VoiceConnectionStatus.Destroyed:
          if (this.nowPlaying !== null) {
            this.textChannel.client.guildData.get(this.textChannel.guildId).queueHistory.unshift(this.nowPlaying);
          }
          this.stop();
          break;
        case VoiceConnectionStatus.Connecting:
        case VoiceConnectionStatus.Signalling:
          try {
            await entersState(this.connection, VoiceConnectionStatus.Ready, 20000);
          } catch {
            if (this.connection.state.status !== VoiceConnectionStatus.Destroyed) {
              this.connection.destroy();
            }
          }
          break;
      }
    });

    this.audioPlayer.on("stateChange", (oldState, newState) => {
      if (newState.status === AudioPlayerStatus.Idle && oldState.status !== AudioPlayerStatus.Idle) {
        if (this.nowPlaying !== null) {
          this.textChannel.client.guildData.get(this.textChannel.guildId).queueHistory.unshift(this.nowPlaying);
        }
        if (this.queue.length) {
          this.process(this.queue);
        } else {
          if (this.connection._state.status !== "destroyed") {
            this.connection.destroy();
            this.textChannel.client.playerManager.delete(this.textChannel.giuldId);
          }
        }
      } else if (newState.status === AudioPlayerStatus.Playing) {
        const queueHistory = this.textChannel.client.guildData.get(this.textChannel.guildId).queueHistory;
        const playingEmbed = new MessageEmbed()
          .setThumbnail(this.nowPlaying.thumbnail)
          .setTitle(this.nowPlaying.title)
          .setColor("#ff0000")
          .addField("Duration", ":stopwatch:" + this.nowPlaying.duration, true)
          .setFooter(`Requested by ${this.nowPlaying.memberDisplayName}!`, this.nowPlaying.memberAvatar);
        if (queueHistory.length) {
          playingEmbed.addField("Previous Song", queueHistory[0].title, true);
        }
        this.textChannel.send({ embeds: [playingEmbed] });
      }
    });

    this.audioPlayer.on("error", (error) => {
      signale.error(error);
    });
  }

  stop() {
    this.queue.length = 0;
    this.nowPlaying = null;
    this.skipTimer = false;
    this.isPreviousTrack = false;
    this.audioPlayer.stop(true);
  }

  async process(queue) {
    if (this.audioPlayer.state.status !== AudioPlayerStatus.Idle || this.queue.length === 0) {
      return;
    }

    const song = this.queue.shift();
    this.nowPlaying = song;

    if (this.commandLock) {
      this.commandLock = false;
    }

    try {
      const stream = ytdl(song.url, {
        filter: "audio",
        quality: "highestaudio",
        highWaterMark: 1 << 25,
      });
      const resource = createAudioResource(stream, {
        inputType: StreamType.Arbitrary,
      });
      this.audioPlayer.play(resource);
    } catch (error) {
      signale.error(error);
      return this.process(queue);
    }
  }
}

module.exports = MusicPlayer;
