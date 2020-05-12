axios.defaults.baseURL = "https://itunes.apple.com/";

new Vue({
  el: "#app",
  data: {
    search: "rock",
    albums: [],
    page: 0,
    perPage: 8,
    type: "album",
    imgmusicAlbum: null,
    musicAlbum: null,
    musicArtist: null,
    musicGenre: null,
    musicTraks: [],
    ids: [],
    audio: null,
    active: null,
    activeMusic: false,
    processing: {
      album: false,
      music: false,
    },
    
  },
  created() {},
  methods: {
    nextPage() {
      this.page++;
      this.getAlbum();
    },
    sendForm() {
      this.page = 0;
      this.ids = [];
      this.albums = [];
      this.getAlbum();
    },
    getAlbum() {
      console.log("OK");
      this.processing.album = true;
      axios
        .get(
          `search?term=${encodeURIComponent(this.search)}&country=MX&media=music&entity=${this.type}&limit=${this.perPage}&offset=${this.page * this.perPage}&sort=recent`
        )
        .then((resp) => {
          let albums = resp.data.results;
          albums.forEach((v, k) => {
            v.artworkUrl100 = v.artworkUrl100.replace("100x100bb", "300x300bb");
            this.albums.push(v);
            this.ids.push(v.collectionId);
          });
          this.processing.album = false;
        })
        .catch((error) => {
          console.error(error);
          this.processing.album = false;
        });
    },
    getMusic(dni) {
      this.activeMusic = true;
      this.active = null;
      if (this.audio) {
        this.audio.pause();
        this.audio = null;
      }

      this.processing.music = true;

      axios
        .get(`https://itunes.apple.com/lookup?id=${dni}&entity=song`)
        .then((resp) => {
          if (resp.data.resultCount > 0) {
            this.imgmusicAlbum = resp.data.results[0].artworkUrl100;
            this.musicAlbum = resp.data.results[0].collectionName;
            this.musicArtist = resp.data.results[0].artistName;
            this.musicGenre = resp.data.results[0].primaryGenreName;
            let i = 0;
            this.musicTraks = [];
            resp.data.results.forEach((element, index) => {
              if (index > 0) {
                this.musicTraks[i] = element;
                i++;
              }
            });
            this.processing.music = false;
          }
        })
        .catch((err) => {
          this.processing.music = false;
          console.log(err)
        });
    },
    play(audio) {
      if (this.audio) {
        this.audio.pause();
      }
      this.audio = new Audio(audio);
      this.audio.play();
    },
  },
});
