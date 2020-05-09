axios.defaults.baseURL = "https://itunes.apple.com/";

new Vue({
  el: "#app",
  data: {
    search: "rock",
    albums: [],
    albumsPage: [],
    page: 1,
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
    // attributes for pagination
    resultsPerPage: 10, // default
    numberPages: 10,
  },
  created() {},
  computed: {
    pagination() {
      return this.page + "/" + this.resultsPerPage;
    },
  },
  methods: {
    previousPage() {
      // reach the first page
      if (this.page > 1) {
        this.page--;
        this.getSliceOfResults();
      }
    },
    nextPage() {
      // reach the last page
      if (this.page < this.numberPages) {
        this.page++;
        this.getSliceOfResults();
      }
    },
    getSliceOfResults() {
      let last = this.page * this.resultsPerPage;
      let initial = last - this.resultsPerPage;
      this.albumsPage = this.albums.slice(initial, last);
    },
    sendForm() {
      this.page = 1;
      this.ids = [];
      this.albums = [];
      this.getAlbum();
    },
    getAlbum() {
      console.log("OK");
      this.processing.album = true;
      axios
        .get(
          `search?term=${encodeURIComponent(
            this.search
          )}&country=MX&media=music&entity=${this.type}`
        )
        .then((resp) => {
          console.log("OK", resp);
          let albums = resp.data.results.filter(function (album) {
            return album.trackCount > 3;
          });
          albums.forEach((v, k) => {
            console.log("albums[k].artworkUrl100", v);
            v.artworkUrl100 = v.artworkUrl100.replace("100x100bb", "300x300bb");
            if (this.ids.indexOf(v.collectionId) < 0) {
              this.albums.push(v);
              this.ids.push(v.collectionId);
            }
          });
          this.albums.sort(function (a, b) {
            return Date.parse(b.releaseDate) - Date.parse(a.releaseDate);
          });
          this.processing.album = false;
          //  first album page load
          this.getSliceOfResults();
        })
        .catch((error) => {
          // console.log(error);
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
          // console.log(err)
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
