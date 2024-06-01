  // Obtenha o elemento de vídeo
  var video = document.getElementById('auroraVideo');
  
  // Defina a velocidade de reprodução para 2x
  video.playbackRate = 2.3;

  // Evento de 'ended' para garantir que o vídeo reinicie quando terminar
  video.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
  }, false);