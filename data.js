// Content for the five presentations. Every string is {pl, en, es}; L() picks the active language.
const T = (pl, en, es) => ({ pl, en, es });

window.PROJECT_NO = ''; // e.g. '2026-1-PL01-KA122-ADU-000xxxxxx'
window.BASE = 'https://lukasz512.github.io/kws-erasmus-ibi/';

window.GROUPS = [
  { id: 0, color: '#1F5FBF', name: T('Niebiescy', 'Blue team', 'Equipo azul') },
  { id: 1, color: '#E0A800', name: T('Żółci', 'Yellow team', 'Equipo amarillo') },
  { id: 2, color: '#2E8B57', name: T('Zieloni', 'Green team', 'Equipo verde') }
];

window.UI = {
  join: T('Dołącz telefonem', 'Join with your phone', 'Únete con tu móvil'),
  scan: T('Zeskanuj kod aparatem telefonu', 'Scan the code with your phone camera', 'Escanea el código con la cámara'),
  pickGroup: T('Wybierz swoją drużynę', 'Choose your team', 'Elige tu equipo'),
  votes: T('Głosy', 'Votes', 'Votos'),
  reveal: T('Pokaż odpowiedź (R)', 'Show answer (R)', 'Mostrar respuesta (R)'),
  correct: T('Dobrze!', 'Correct!', '¡Correcto!'),
  wrong: T('Niestety nie', 'Not this time', 'Esta vez no'),
  thanks: T('Dziękujemy! Głos zapisany.', 'Thank you! Vote saved.', '¡Gracias! Voto guardado.'),
  wait: T('Patrz na ekran, zaraz kolejne pytanie.', 'Watch the screen, the next question is coming.', 'Mira la pantalla, ya viene la siguiente pregunta.'),
  score: T('Wyniki drużyn', 'Team scores', 'Puntuación de equipos'),
  tablet: T('Zadanie na tablet', 'Tablet task', 'Tarea con la tableta'),
  points: T('pkt', 'pts', 'ptos'),
  before: T('Przed', 'Before', 'Antes'),
  after: T('Po', 'After', 'Después'),
  lang: T('Ten slajd w Twoim języku', 'This slide in your language', 'Esta diapositiva en tu idioma'),
  change: T('zmień drużynę', 'change team', 'cambiar equipo'),
  cofund: T('Współfinansowane przez Unię Europejską', 'Co-funded by the European Union', 'Cofinanciado por la Unión Europea'),
  disclaimer: T(
    'Sfinansowane ze środków UE. Wyrażone poglądy i opinie są jedynie opiniami autora lub autorów i niekoniecznie odzwierciedlają poglądy i opinie Unii Europejskiej lub Europejskiej Agencji Wykonawczej ds. Edukacji i Kultury (EACEA). Unia Europejska ani EACEA nie ponoszą za nie odpowiedzialności.',
    'Funded by the European Union. Views and opinions expressed are however those of the author(s) only and do not necessarily reflect those of the European Union or the European Education and Culture Executive Agency (EACEA). Neither the European Union nor EACEA can be held responsible for them.',
    'Financiado por la Unión Europea. Las opiniones y puntos de vista expresados solo comprometen a su(s) autor(es) y no reflejan necesariamente los de la Unión Europea o los de la Agencia Ejecutiva Europea de Educación y Cultura (EACEA). Ni la Unión Europea ni la EACEA pueden ser considerados responsables de ellos.'
  ),
  certTitle: T('Certyfikat uczestnictwa', 'Certificate of participation', 'Certificado de participación'),
  certName: T('Wpisz imię i nazwisko', 'Type your full name', 'Escribe tu nombre y apellido'),
  certSave: T('Zapisz jako PDF', 'Save as PDF', 'Guardar como PDF'),
  certBody: T(
    'wziął(-ęła) udział w mobilności edukacyjnej Erasmus+ „KASZËBI W EUROPIE!” w Ibi i Alicante (Hiszpania), 11–21 października 2026, i rozwijał(a) kompetencje: cyfrowe, sztuczna inteligencja, rozpoznawanie dezinformacji, bezpieczeństwo w sieci, język angielski i kompetencje międzykulturowe.',
    'took part in the Erasmus+ learning mobility “KASZËBI IN EUROPE!” in Ibi and Alicante (Spain), 11–21 October 2026, developing: digital skills, artificial intelligence, recognising disinformation, online safety, English and intercultural skills.',
    'participó en la movilidad educativa Erasmus+ «KASZËBI EN EUROPA» en Ibi y Alicante (España), del 11 al 21 de octubre de 2026, desarrollando: competencias digitales, inteligencia artificial, detección de desinformación, seguridad en internet, inglés y competencias interculturales.'
  )
};

// Light opinion polls (no correct answer, no points).
window.Q = {
  j_best: { q: T('Które miejsce podobało się Wam najbardziej?', 'Which place did you like most?', '¿Qué lugar os gustó más?'), a: [T('Alicante z przewodnikiem', 'Alicante guided tour', 'Alicante con guía'), T('Villajoyosa i Valor', 'Villajoyosa and Valor', 'Villajoyosa y Valor'), T('Elche – Park Palmowy', 'Elche – Palm Grove', 'Elche – Palmeral'), T('Gra miejska', 'City game', 'Juego urbano')] },
  p3_surprise: { q: T('Co Was najbardziej zaskoczyło w Hiszpanii?', 'What surprised you most in Spain?', '¿Qué os sorprendió más de España?'), a: [T('Późne godziny posiłków', 'Late meal times', 'Los horarios de comida'), T('Pogoda', 'The weather', 'El tiempo'), T('Ludzie', 'The people', 'La gente'), T('Jedzenie', 'The food', 'La comida')] },
  p3_bring: { q: T('Co przenieślibyście z Hiszpanii na Kaszuby?', 'What would you bring from Spain to Kashubia?', '¿Qué llevaríais de España a Casubia?'), a: [T('Sjestę', 'The siesta', 'La siesta'), T('Życie na ulicy wieczorem', 'Evening street life', 'La vida en la calle por la noche'), T('Święta z ogniem i fajerwerkami', 'Fire and fireworks festivals', 'Fiestas con fuego y petardos'), T('Kuchnię', 'The food', 'La cocina')] },
  dz_signal: { q: T('Co w tym poście jest sygnałem manipulacji?', 'What in this post signals manipulation?', '¿Qué en esta publicación indica manipulación?'), a: [T('„PILNE!” i wielkie litery', '“URGENT!” and capital letters', '«¡URGENTE!» y mayúsculas'), T('„Udostępnij, zanim usuną”', '“Share before they delete it”', '«Comparte antes de que lo borren»'), T('Brak źródła', 'No source', 'No hay fuente'), T('Wszystko powyżej', 'All of the above', 'Todo lo anterior')] },
  dz_share: { q: T('Czy przed udostępnieniem sprawdzisz źródło?', 'Will you check the source before sharing?', '¿Comprobarás la fuente antes de compartir?'), a: [T('Tak, zawsze', 'Yes, always', 'Sí, siempre'), T('Czasami', 'Sometimes', 'A veces'), T('Nie', 'No', 'No')] },
  bz_sms: { q: T('Czy dostaliście kiedyś podejrzanego SMS-a lub telefon?', 'Have you ever had a suspicious text or call?', '¿Habéis recibido alguna vez un SMS o llamada sospechosa?'), a: [T('Tak, SMS', 'Yes, a text', 'Sí, un SMS'), T('Tak, telefon', 'Yes, a call', 'Sí, una llamada'), T('Jedno i drugie', 'Both', 'Las dos cosas'), T('Nie', 'No', 'No')] },
  bz_word: { q: T('Czy ustalicie z rodziną słowo-hasło na wypadek fałszywego telefonu?', 'Will you agree a family code word against fake calls?', '¿Acordaréis una palabra clave familiar contra llamadas falsas?'), a: [T('Tak', 'Yes', 'Sí'), T('Nie', 'No', 'No'), T('Już mamy', 'We already have one', 'Ya tenemos una')] }
};

// Disinformation survey: the same 10 questions before (pre) and after (post) the mobility.
// Disinformation survey (plan: Claude Doc "Ankieta przed/po"). Parts: A problem (pre), B self-assessment 1–5 (pre+post),
// C knowledge test (pre+post, scored), D evaluation (post). B and C are identical in both rounds.
window.SURVEY = [
  { id: 'A1', part: 'A', ph: ['pre'], type: 'choice', q: T('Skąd najczęściej dowiadujesz się, co dzieje się na świecie?', 'Where do you usually get your news?', '¿Dónde sueles informarte de lo que pasa?'), a: [T('Facebook i inne media społecznościowe', 'Facebook and other social media', 'Facebook y otras redes sociales'), T('Telewizja', 'Television', 'Televisión'), T('Radio lub gazety', 'Radio or newspapers', 'Radio o periódicos'), T('Rodzina i znajomi', 'Family and friends', 'Familia y amigos')] },
  { id: 'A2', part: 'A', ph: ['pre'], type: 'choice', q: T('Jak często widzisz w internecie wiadomości, co do których masz wątpliwości, czy są prawdziwe?', 'How often do you see news online that you doubt is true?', '¿Con qué frecuencia ves en internet noticias de las que dudas?'), a: [T('Codziennie', 'Every day', 'Cada día'), T('Kilka razy w tygodniu', 'A few times a week', 'Varias veces por semana'), T('Rzadko', 'Rarely', 'Rara vez'), T('Nigdy, nie korzystam z internetu', "Never, I don't use the internet", 'Nunca, no uso internet')] },
  { id: 'A3', part: 'A', ph: ['pre'], type: 'choice', q: T('Czy w ostatnich 3 miesiącach dostałeś(-aś) podejrzany SMS, e-mail lub telefon?', 'In the last 3 months, have you had a suspicious text, email or call?', 'En los últimos 3 meses, ¿has recibido un SMS, correo o llamada sospechosa?'), a: [T('Tak, SMS lub e-mail', 'Yes, a text or email', 'Sí, un SMS o correo'), T('Tak, telefon', 'Yes, a call', 'Sí, una llamada'), T('Jedno i drugie', 'Both', 'Las dos cosas'), T('Nie', 'No', 'No')] },
  { id: 'A4', part: 'A', ph: ['pre'], type: 'choice', q: T('Czy zdarzyło Ci się przekazać dalej informację, która okazała się nieprawdą?', 'Have you ever passed on information that turned out to be false?', '¿Alguna vez has compartido información que resultó ser falsa?'), a: [T('Tak', 'Yes', 'Sí'), T('Nie', 'No', 'No'), T('Nie wiem', "I don't know", 'No lo sé')] },
  { id: 'B1', part: 'B', ph: ['pre', 'post'], type: 'likert', q: T('Potrafię odróżnić prawdziwą wiadomość od fałszywej.', 'I can tell real news from fake news.', 'Sé distinguir una noticia verdadera de una falsa.') },
  { id: 'B2', part: 'B', ph: ['pre', 'post'], type: 'likert', q: T('Zanim udostępnię wiadomość, sprawdzam, skąd pochodzi.', 'Before I share news, I check where it comes from.', 'Antes de compartir una noticia, compruebo de dónde viene.') },
  { id: 'B3', part: 'B', ph: ['pre', 'post'], type: 'likert', q: T('Wiem, jak sprawdzić, skąd pochodzi zdjęcie.', 'I know how to check where a photo comes from.', 'Sé cómo comprobar de dónde viene una foto.') },
  { id: 'B4', part: 'B', ph: ['pre', 'post'], type: 'likert', q: T('Rozumiem, czym jest sztuczna inteligencja i jak może podrobić głos lub zdjęcie.', 'I understand what AI is and how it can fake a voice or a photo.', 'Entiendo qué es la IA y cómo puede falsificar una voz o una foto.') },
  { id: 'B5', part: 'B', ph: ['pre', 'post'], type: 'likert', q: T('Czuję się bezpiecznie, korzystając z internetu i telefonu.', 'I feel safe using the internet and my phone.', 'Me siento seguro/a usando internet y el móvil.') },
  { id: 'C1', part: 'C', ph: ['pre', 'post'], type: 'test', q: T('W internecie widzisz szokujące zdjęcie „z wczoraj”. Co robisz najpierw?', 'You see a shocking photo “from yesterday” online. What do you do first?', 'Ves en internet una foto impactante «de ayer». ¿Qué haces primero?'), a: [T('Udostępniam, żeby ostrzec innych', 'Share it to warn others', 'La comparto para avisar a otros'), T('Sprawdzam w Google Lens, skąd i z kiedy jest zdjęcie', 'Check in Google Lens where and when it was taken', 'Compruebo con Google Lens de dónde y cuándo es'), T('Czytam komentarze', 'Read the comments', 'Leo los comentarios')], ok: 1 },
  { id: 'C2', part: 'C', ph: ['pre', 'post'], type: 'test', q: T('Najpewniejszy sposób sprawdzenia wiadomości to…', 'The surest way to check a news story is…', 'La forma más segura de comprobar una noticia es…'), a: [T('znaleźć ją w kilku niezależnych, znanych źródłach', 'find it in several independent, known sources', 'encontrarla en varias fuentes conocidas e independientes'), T('liczba udostępnień', 'the number of shares', 'el número de veces compartida'), T('czy napisał ją ktoś znajomy', 'whether someone I know wrote it', 'si la escribió alguien conocido')], ok: 0 },
  { id: 'C3', part: 'C', ph: ['pre', 'post'], type: 'test', q: T('Deepfake to…', 'A deepfake is…', 'Un deepfake es…'), a: [T('fałszywe nagranie lub zdjęcie zrobione przez AI', 'a fake video or photo made by AI', 'un vídeo o foto falsa hecha con IA'), T('program antywirusowy', 'an antivirus program', 'un antivirus'), T('rodzaj reklamy', 'a kind of advert', 'un tipo de anuncio')], ok: 0 },
  { id: 'C4', part: 'C', ph: ['pre', 'post'], type: 'test', q: T('Dzwoni „wnuczek” – to jego głos – i pilnie prosi o pieniądze. Co robisz?', 'Your “grandchild” calls – it is their voice – urgently asking for money. What do you do?', 'Llama tu «nieto» – es su voz – y pide dinero urgente. ¿Qué haces?'), a: [T('Przelewam, bo to jego głos', 'Send it, it is their voice', 'Hago la transferencia, es su voz'), T('Rozłączam się i oddzwaniam na znany numer', 'Hang up and call back on a known number', 'Cuelgo y llamo a un número conocido'), T('Podaję kod z SMS-a', 'Give the SMS code', 'Doy el código del SMS')], ok: 1 },
  { id: 'C5', part: 'C', ph: ['pre', 'post'], type: 'test', q: T('Po czym często poznać obraz wygenerowany przez AI?', 'What often gives away an AI-generated image?', '¿Qué suele delatar una imagen hecha con IA?'), a: [T('Dziwne dłonie i palce, rozmyte napisy', 'Odd hands and fingers, blurry writing', 'Manos y dedos raros, letras borrosas'), T('Zawsze jest czarno-biały', 'It is always black and white', 'Siempre es en blanco y negro'), T('Ma podpis autora', "It has the author's signature", 'Lleva la firma del autor')], ok: 0 },
  { id: 'C6', part: 'C', ph: ['pre', 'post'], type: 'test', q: T('Nagłówek „SZOK! Lekarze ukrywają ten prosty sposób!” to najczęściej…', 'The headline “SHOCK! Doctors hide this simple trick!” is usually…', 'El titular «¡IMPACTANTE! ¡Los médicos ocultan este truco!» suele ser…'), a: [T('przynęta na kliknięcia (clickbait)', 'clickbait', 'un cebo para clics (clickbait)'), T('komunikat ministerstwa', 'a ministry announcement', 'un comunicado del ministerio'), T('artykuł naukowy', 'a scientific article', 'un artículo científico')], ok: 0 },
  { id: 'C7', part: 'C', ph: ['pre', 'post'], type: 'test', q: T('Konto bez zdjęcia, założone tydzień temu, pisze setki komentarzy dziennie. To prawdopodobnie…', 'An account with no photo, created a week ago, posts hundreds of comments a day. It is probably…', 'Una cuenta sin foto, creada hace una semana, publica cientos de comentarios al día. Probablemente es…'), a: [T('dziennikarz', 'a journalist', 'un periodista'), T('urząd gminy', 'the town hall', 'el ayuntamiento'), T('bot lub fałszywe konto', 'a bot or fake account', 'un bot o una cuenta falsa')], ok: 2 },
  { id: 'C8', part: 'C', ph: ['pre', 'post'], type: 'test', q: T('Do czego służą strony Demagog.org.pl i Maldita.es?', 'What are Demagog.org.pl and Maldita.es for?', '¿Para qué sirven Demagog.org.pl y Maldita.es?'), a: [T('Do zakupów', 'Shopping', 'Para comprar'), T('Do sprawdzania faktów (fact-checking)', 'Fact-checking', 'Para verificar datos (fact-checking)'), T('Do gier', 'Games', 'Para jugar')], ok: 1 },
  { id: 'C9', part: 'C', ph: ['pre', 'post'], type: 'test', q: T('Post kończy się słowami „Udostępnij, zanim usuną!”. To…', 'A post ends with “Share before they delete it!”. That is…', 'Una publicación termina con «¡Comparte antes de que lo borren!». Eso es…'), a: [T('dowód, że to prawda', 'proof that it is true', 'una prueba de que es verdad'), T('prośba administratora', 'a request from the admin', 'una petición del administrador'), T('typowy sygnał manipulacji', 'a typical sign of manipulation', 'una señal típica de manipulación')], ok: 2 },
  { id: 'C10', part: 'C', ph: ['pre', 'post'], type: 'test', q: T('Udostępniłem fałszywą informację. Co teraz?', 'I shared false information. What now?', 'He compartido información falsa. ¿Y ahora?'), a: [T('Nic, i tak się rozejdzie', 'Nothing, it will spread anyway', 'Nada, se difundirá igual'), T('Udostępniam jeszcze raz', 'Share it again', 'La comparto otra vez'), T('Usuwam post i mówię znajomym, że to był fałsz', 'Delete the post and tell friends it was false', 'Borro la publicación y aviso de que era falso')], ok: 2 },
  { id: 'D1', part: 'D', ph: ['post'], type: 'choice', q: T('Czy po tym wyjeździe będziesz sprawdzać źródło przed udostępnieniem?', 'After this trip, will you check the source before sharing?', 'Después de este viaje, ¿comprobarás la fuente antes de compartir?'), a: [T('Tak, zawsze', 'Yes, always', 'Sí, siempre'), T('Czasami', 'Sometimes', 'A veces'), T('Nie', 'No', 'No')] },
  { id: 'D2', part: 'D', ph: ['post'], type: 'choice', q: T('Czy ustalicie z rodziną słowo-hasło na wypadek fałszywego telefonu?', 'Will you agree a family code word against fake calls?', '¿Acordaréis una palabra clave familiar contra llamadas falsas?'), a: [T('Tak', 'Yes', 'Sí'), T('Nie', 'No', 'No'), T('Już mamy', 'We already have one', 'Ya tenemos una')] },
  { id: 'D3', part: 'D', ph: ['post'], type: 'choice', q: T('Które miejsce podobało się Wam najbardziej?', 'Which place did you like most?', '¿Qué lugar os gustó más?'), a: [T('Alicante z przewodnikiem', 'Alicante guided tour', 'Alicante con guía'), T('Villajoyosa i Valor', 'Villajoyosa and Valor', 'Villajoyosa y Valor'), T('Elche – Park Palmowy', 'Elche – Palm Grove', 'Elche – Palmeral'), T('Gra miejska', 'City game', 'Juego urbano')] },
  { id: 'D4', part: 'D', ph: ['post'], type: 'choice', q: T('Co przenieślibyście z Hiszpanii na Kaszuby?', 'What would you bring from Spain to Kashubia?', '¿Qué llevaríais de España a Casubia?'), a: [T('Sjestę', 'The siesta', 'La siesta'), T('Życie na ulicy wieczorem', 'Evening street life', 'La vida en la calle por la noche'), T('Święta z ogniem', 'Fire festivals', 'Fiestas con fuego'), T('Kuchnię', 'The food', 'La cocina')] },
  { id: 'D5', part: 'D', ph: ['post'], type: 'choice', q: T('Czy poleciłbyś(-abyś) udział w takim projekcie innym?', 'Would you recommend a project like this to others?', '¿Recomendarías un proyecto así a otras personas?'), a: [T('Tak', 'Yes', 'Sí'), T('Raczej tak', 'Probably yes', 'Probablemente sí'), T('Nie', 'No', 'No')] }
];
window.LIKERT = [T('zupełnie się nie zgadzam', 'strongly disagree', 'muy en desacuerdo'), T('raczej nie', 'disagree', 'en desacuerdo'), T('trudno powiedzieć', 'not sure', 'no sé'), T('raczej tak', 'agree', 'de acuerdo'), T('całkowicie się zgadzam', 'strongly agree', 'muy de acuerdo')];
window.LIKERT_FACE = ['😟', '🙁', '😐', '🙂', '😀'];
window.PARTS = { A: T('Twoje doświadczenia', 'Your experience', 'Tu experiencia'), B: T('Jak się czujesz w sieci', 'How you feel online', 'Cómo te sientes en internet'), C: T('Sprawdź swoją wiedzę', 'Test your knowledge', 'Pon a prueba tus conocimientos'), D: T('Ocena wyjazdu', 'About the trip', 'Sobre el viaje') };

window.SURVEY_UI = {
  title: T('Ankieta: dezinformacja', 'Survey: disinformation', 'Encuesta: desinformación'),
  pre: T('PRZED mobilnością', 'BEFORE the mobility', 'ANTES de la movilidad'),
  post: T('PO mobilności', 'AFTER the mobility', 'DESPUÉS de la movilidad'),
  code: T('Twój anonimowy kod', 'Your anonymous code', 'Tu código anónimo'),
  codeHelp: T('Pierwsza litera imienia mamy + dzień Twoich urodzin, np. A07. Ten sam kod przed i po.', "First letter of your mother's name + your day of birth, e.g. A07. Same code before and after.", 'Primera letra del nombre de tu madre + tu día de nacimiento, p. ej. A07. El mismo código antes y después.'),
  start: T('Zaczynam', 'Start', 'Empezar'),
  send: T('Wyślij odpowiedzi', 'Send answers', 'Enviar respuestas'),
  done: T('Dziękujemy! Ankieta wysłana.', 'Thank you! Survey sent.', '¡Gracias! Encuesta enviada.'),
  filled: T('Wypełniło', 'Completed', 'Completadas'),
  avg: T('Średni wynik grupy', 'Group average', 'Media del grupo'),
  growth: T('Wzrost wiedzy', 'Knowledge gain', 'Aumento de conocimiento'),
  target: T('cel z wniosku', 'project target', 'objetivo del proyecto'),
  perPerson: T('Wynik każdej osoby (kod)', 'Each person (code)', 'Cada persona (código)'),
  teams: T('Drużyny: punkty = wzrost wyniku', 'Teams: points = score gain', 'Equipos: puntos = aumento'),
  paired: T('osób wypełniło przed i po', 'people completed before and after', 'personas completaron antes y después'),
  confidence: T('Pewność siebie w sieci (1–5)', 'Confidence online (1–5)', 'Confianza en internet (1–5)'),
  problem: T('Skala problemu przed wyjazdem', 'The problem before the trip', 'El problema antes del viaje'),
  evaluation: T('Ocena wyjazdu', 'About the trip', 'Sobre el viaje'),
  sending: T('Wysyłanie…', 'Sending…', 'Enviando…'),
  failed: T('Brak połączenia. Pokaż ten kod prowadzącemu – wpisze Twoje odpowiedzi:', 'No connection. Show this code to the presenter, who will enter your answers:', 'Sin conexión. Enseña este código a la persona que presenta:'),
  intro: T('Ankieta jest anonimowa i zajmuje ok. 12 minut.', 'The survey is anonymous and takes about 12 minutes.', 'La encuesta es anónima y dura unos 12 minutos.')
};

// Journey: map stops (lng, lat), shown step by step on one 3D map slide.
window.KASZUBY = [[17.45, 54.76], [17.9, 54.82], [18.4, 54.78], [18.56, 54.55], [18.47, 54.36], [18.42, 54.16], [18.45, 54.03], [18.12, 53.93], [17.98, 53.78], [17.7, 53.86], [17.38, 53.97], [16.98, 54.02], [17.13, 54.2], [17.22, 54.42], [17.42, 54.56], [17.45, 54.76]];
window.STOPS = [
  { id: 'kaszuby', at: [17.62, 54.22], zoom: 7.6, pitch: 35, bearing: 0, img: 'img/kaszuby.jpg?v=10', date: T('Skąd jesteśmy', 'Where we come from', 'De dónde venimos'), h: T('Kaszuby · Nakla', 'Kashubia · Nakla', 'Casubia · Nakla'), p: T('Wieś Nakla (ok. 400 mieszkańców) w sercu Kaszub: jeziora, lasy, własny język.', 'Nakla village (about 400 people) in the heart of Kashubia: lakes, forests, our own language.', 'El pueblo de Nakla (unos 400 habitantes) en el corazón de Casubia: lagos, bosques y lengua propia.') },
  { id: 'fly', at: [-0.558, 38.282], fly: [[18.466, 54.377], [-0.558, 38.282]], zoom: 4.2, pitch: 20, bearing: 0, date: T('11.10 · niedziela', '11 Oct · Sunday', '11 oct · domingo'), h: T('Gdańsk → Alicante', 'Gdańsk → Alicante', 'Gdańsk → Alicante'), p: T('Ok. 2 300 km i 3,5 godziny lotu.', 'About 2,300 km and a 3.5-hour flight.', 'Unos 2.300 km y 3,5 horas de vuelo.') },
  { id: 'ibi', at: [-0.5725, 38.6265], zoom: 13.5, pitch: 60, bearing: -20, img: 'img/ibi.jpg', date: T('Partner', 'Host', 'Socio'), h: T('Ibi · Blue Beehive', 'Ibi · Blue Beehive', 'Ibi · Blue Beehive'), p: T('Miasto zabawek w górach, ok. 800 m n.p.m. Stąd jest nasz partner.', 'The toy town in the mountains, about 800 m up. Home of our host organisation.', 'La ciudad del juguete en la montaña, a unos 800 m. De aquí es nuestro socio.') },
  { id: 'alicante', at: [-0.478, 38.349], zoom: 15.2, pitch: 65, bearing: 30, img: 'img/alicante.jpg', date: T('12.10 · poniedziałek', '12 Oct · Monday', '12 oct · lunes'), h: T('Alicante z przewodnikiem', 'Alicante guided tour', 'Alicante con guía'), p: T('Zwiedzanie z polskojęzycznym przewodnikiem: zamek Santa Bárbara i stare miasto. Po południu czas wolny.', 'A tour with a Polish-speaking guide: Santa Bárbara Castle and the old town. Free afternoon.', 'Visita con guía en polaco: castillo de Santa Bárbara y casco antiguo. Tarde libre.') },
  { id: 'fuego', at: [-0.4853, 38.3468], zoom: 16, pitch: 60, bearing: -10, img: 'img/hogueras.jpg', date: T('13.10 · wtorek', '13 Oct · Tuesday', '13 oct · martes'), h: T('Warsztaty · Muzeum Ognia', 'Workshops · Fire Museum', 'Talleres · Museo del Fuego'), p: T('10:00–12:00 warsztaty z partnerem. Po południu Muzeum Ognia.', '10:00–12:00 workshops with our host. Fire Museum in the afternoon.', '10:00–12:00 talleres con el socio. Por la tarde, Museo del Fuego.') },
  { id: 'vila', at: [-0.2335, 38.5075], zoom: 15, pitch: 60, bearing: 40, img: 'img/valor.jpg?v=12', date: T('14.10 · środa', '14 Oct · Wednesday', '14 oct · miércoles'), h: T('Villajoyosa · Valor', 'Villajoyosa · Valor', 'Villajoyosa · Valor'), p: T('Plaża i fabryka czekolady Valor (od 1881). Dojazd tramwajem.', 'The beach and the Valor chocolate factory (since 1881). By tram.', 'Playa y fábrica de chocolate Valor (desde 1881). En tranvía.') },
  { id: 'game', at: [-0.483, 38.343], zoom: 16, pitch: 65, bearing: 70, img: 'img/explanada.jpg', date: T('15.10 · czwartek', '15 Oct · Thursday', '15 oct · jueves'), h: T('Warsztaty · gra miejska', 'Workshops · city game', 'Talleres · juego urbano'), p: T('Zadania na Explanadzie: mozaika z ok. 6,5 mln kafelków.', 'Tasks on the Explanada, a mosaic of about 6.5 million tiles.', 'Retos en la Explanada, un mosaico de unos 6,5 millones de teselas.') },
  { id: 'modraki', at: [-0.49, 38.345], zoom: 14, pitch: 50, bearing: 0, date: T('16.10 · piątek', '16 Oct · Friday', '16 oct · viernes'), h: T('Koncert zespołu Modraki', 'Modraki band concert', 'Concierto del grupo Modraki'), p: T('Kaszubska muzyka w Hiszpanii, razem z partnerem.', 'Kashubian music in Spain, together with our host.', 'Música casubia en España, junto con el socio.') },
  { id: 'hotel17', at: [-0.5173, 38.314], zoom: 16, pitch: 60, bearing: 20, date: T('17.10 · sobota', '17 Oct · Saturday', '17 oct · sábado'), h: T('Warsztaty', 'Workshops', 'Talleres'), p: T('10:00–12:00 warsztaty z partnerem. Po południu czas wolny.', '10:00–12:00 workshops with our host. Free afternoon.', '10:00–12:00 talleres con el socio. Tarde libre.') },
  { id: 'elche', at: [-0.6889, 38.2668], zoom: 15, pitch: 60, bearing: -30, img: 'img/elche.jpg', date: T('18.10 · niedziela', '18 Oct · Sunday', '18 oct · domingo'), h: T('Elche · Park Palmowy', 'Elche · Palm Grove', 'Elche · Palmeral'), p: T('Ponad 200 000 palm, lista UNESCO. Dojazd pociągiem.', 'Over 200,000 palms, a UNESCO site. By train.', 'Más de 200.000 palmeras, Patrimonio UNESCO. En tren.') },
  { id: 'hotel19', at: [-0.5173, 38.314], zoom: 16.5, pitch: 60, bearing: -20, date: T('19.10 · poniedziałek', '19 Oct · Monday', '19 oct · lunes'), h: T('Warsztaty · nasza baza', 'Workshops · our base', 'Talleres · nuestra base'), p: T('10:00–12:00 warsztaty. B&B HOTEL Alicante, C. Bélgica 1. Po południu czas wolny.', '10:00–12:00 workshops. B&B HOTEL Alicante, C. Bélgica 1. Free afternoon.', '10:00–12:00 talleres. B&B HOTEL Alicante, C. Bélgica 1. Tarde libre.') },
  { id: 'hotel20', at: [-0.5173, 38.314], zoom: 17, pitch: 65, bearing: 40, date: T('20.10 · wtorek', '20 Oct · Tuesday', '20 oct · martes'), h: T('Quiz podsumowujący', 'Final quiz', 'Quiz final'), p: T('10:00–12:00 quiz podsumowujący. Po południu czas wolny.', '10:00–12:00 final quiz. Free afternoon.', '10:00–12:00 quiz final. Tarde libre.') },
  { id: 'back', at: [17.62, 54.22], fly: [[-0.558, 38.282], [18.466, 54.377]], zoom: 5, pitch: 20, bearing: 0, date: T('21.10 · środa', '21 Oct · Wednesday', '21 oct · miércoles'), h: T('Dzień wolny i powrót', 'Free day and flight home', 'Día libre y vuelta'), p: T('Wylot do Gdańska o 21:05. Wracamy z nową wiedzą.', 'Flight to Gdańsk at 21:05. We come home with new knowledge.', 'Vuelo a Gdańsk a las 21:05. Volvemos con nuevos conocimientos.') }
];

window.GUESS = {
  g_elche: { img: 'img/elche.jpg', at: [-0.6889, 38.2668], name: T('Elche, Palmeral', 'Elche, Palm Grove', 'Elche, Palmeral') },
  g_vila: { img: 'img/villajoyosa.jpg', at: [-0.2335, 38.5075], name: T('Villajoyosa', 'Villajoyosa', 'Villajoyosa') },
  g_ibi: { img: 'img/fiesta_ibi.jpg', at: [-0.5717, 38.6266], name: T('Ibi, Muzeum Zabawek', 'Ibi, Toy Museum', 'Ibi, Museo del Juguete') }
};
window.REGION_VIEW = { center: [-0.5, 38.45], zoom: 8.6 };

window.MAP_UI = {
  guessQ: T('Gdzie zrobiono to zdjęcie?', 'Where was this photo taken?', '¿Dónde se hizo esta foto?'),
  guessHelp: T('Dotknij mapy w miejscu, gdzie to jest, i zatwierdź.', 'Tap the map where it is, then confirm.', 'Toca el mapa donde está y confirma.'),
  pinQ: T('Wasze ulubione miejsce w Hiszpanii', 'Your favourite place in Spain', 'Vuestro lugar favorito en España'),
  pinHelp: T('Dotknij mapy i wbij pinezkę.', 'Tap the map to drop a pin.', 'Toca el mapa para poner un pin.'),
  confirm: T('Zatwierdź', 'Confirm', 'Confirmar'),
  closest: T('Najbliżej', 'Closest', 'Más cerca'),
  km: T('km', 'km', 'km'),
  answers: T('odpowiedzi', 'answers', 'respuestas')
};

window.DECKS = [
  {
    id: 'p1', title: T('Podróż: z Kaszub do Alicante – i co nas łączy', 'The journey: from Kashubia to Alicante – and what we share', 'El viaje: de Casubia a Alicante – y lo que compartimos'),
    slides: [
      { k: 'title', kicker: T('Erasmus+ · Edukacja dorosłych', 'Erasmus+ · Adult education', 'Erasmus+ · Educación de adultos'), h: T('KASZËBI W EUROPIE!', 'KASZËBI IN EUROPE!', '¡CASUBIOS EN EUROPA!'), p: T('Rzetelna i nowoczesna edukacja cyfrowa na terenach wiejskich · Ibi i Alicante, 11–21.10.2026', 'Reliable, modern digital education in rural areas · Ibi and Alicante, 11–21 Oct 2026', 'Educación digital fiable y moderna en zonas rurales · Ibi y Alicante, 11–21 oct 2026'), img: 'img/alicante.jpg' },
      { k: 'join' },
      { k: 'text', h: T('Kim jesteśmy', 'Who we are', 'Quiénes somos'), img: 'img/fundacja.jpg', wide: true, li: [
        T('Organizacja pozarządowa (NGO): fundacja non-profit z kaszubskiej wsi Nakla, działamy od 2023 r.', 'A non-governmental organisation (NGO): a non-profit foundation from the Kashubian village of Nakla, active since 2023', 'Una organización no gubernamental (ONG): fundación sin ánimo de lucro del pueblo casubio de Nakla, activa desde 2023'),
        T('Ok. 120 dorosłych słuchaczy ze wsi: koła gospodyń wiejskich i seniorzy, wszystkie zajęcia bezpłatne', 'About 120 adult learners from villages: rural women’s circles and seniors, all classes free of charge', 'Unos 120 alumnos adultos de pueblos: asociaciones de mujeres rurales y mayores, todas las clases gratuitas'),
        T('Uczymy kompetencji cyfrowych i języków, a kaszubski haft, język i tradycje pokazujemy w Europie', 'We teach digital and language skills, and take Kashubian embroidery, language and traditions to Europe', 'Enseñamos competencias digitales e idiomas, y llevamos el bordado, la lengua y las tradiciones casubias a Europa'),
        T('3 projekty Erasmus+: Teneryfa, „Kaszëbi w Europie” i partnerstwo ze Słowacją (na zdjęciu)', '3 Erasmus+ projects: Tenerife, “Kaszëbi w Europie” and a partnership with Slovakia (in the photo)', '3 proyectos Erasmus+: Tenerife, «Kaszëbi w Europie» y una asociación con Eslovaquia (en la foto)')
      ] },
      { k: 'text', h: T('Nasz projekt', 'Our project', 'Nuestro proyecto'), img: 'img/tablet.jpg', li: [
        T('„KASZËBI W EUROPIE! – zapewnienie dostępu do rzetelnej i nowoczesnej edukacji cyfrowej na terenach wiejskich”', '“KASZËBI IN EUROPE! – ensuring access to reliable and modern digital education in rural areas”', '«¡CASUBIOS EN EUROPA! – garantizar el acceso a una educación digital fiable y moderna en zonas rurales»'),
        T('Partner: Associació Educativa i Cultural Blue Beehive z Ibi', 'Host: Associació Educativa i Cultural Blue Beehive, Ibi', 'Socio: Associació Educativa i Cultural Blue Beehive, Ibi'),
        T('Uczymy się: tablety i AI, rozpoznawanie fake newsów, bezpieczeństwo w sieci, angielski', 'We learn: tablets and AI, spotting fake news, online safety, English', 'Aprendemos: tabletas e IA, detectar bulos, seguridad en internet, inglés'),
        T('Finansuje Unia Europejska – program Erasmus+', 'Funded by the European Union – Erasmus+', 'Financiado por la Unión Europea – Erasmus+')
      ] },
      { k: 'journey' },
      { k: 'guess', g: 'g_elche' },
      { k: 'guess', g: 'g_vila' },
      { k: 'guess', g: 'g_ibi' },
      { k: 'compare', a: { img: 'img/kaszuby.jpg?v=10', h: T('Kaszuby: jeziora i lasy', 'Kashubia: lakes and forests', 'Casubia: lagos y bosques') }, b: { img: 'img/villajoyosa.jpg', h: T('Walencja: góry i morze', 'Valencia: mountains and sea', 'Valencia: montaña y mar') } },
      { k: 'compare', a: { img: 'img/haft.jpg', h: T('Haft kaszubski', 'Kashubian embroidery', 'Bordado casubio') }, b: { img: 'img/paella.jpg', h: T('Paella z Walencji', 'Valencian paella', 'Paella valenciana') } },
      { k: 'compare', a: { img: 'img/dozynki.jpg?v=23', h: T('Dożynki (òżniwinë) w Parchowie', 'Harvest festival in Parchowo', 'Fiesta de la cosecha en Parchowo') }, b: { img: 'img/hogueras.jpg', h: T('Hogueras: święto ognia', 'Hogueras: the fire festival', 'Hogueras: la fiesta del fuego') } },
      { k: 'phrases', h: T('Ważne zwroty', 'Useful phrases', 'Frases útiles'), rows: [
        [T('Witajcie!', 'Welcome!', '¡Bienvenidos!'), 'Witôjtaż!', '¡Bienvenidos!', 'Benvinguts!'],
        [T('Dzień dobry', 'Good morning', 'Buenos días'), 'Dobri dzéń', 'Buenos días', 'Bon dia'],
        [T('Dziękuję', 'Thank you', 'Gracias'), 'Dzãkùjã', 'Gracias', 'Gràcies'],
        [T('Tak / Nie', 'Yes / No', 'Sí / No'), 'Jo / Nié', 'Sí / No', 'Sí / No'],
        [T('Jak się masz?', 'How are you?', '¿Cómo estás?'), 'Jak sã môsz?', '¿Cómo estás?', 'Com estàs?'],
        [T('Smacznego!', 'Enjoy your meal!', '¡Buen provecho!'), 'Smacznégò!', '¡Buen provecho!', 'Bon profit!'],
        [T('Na zdrowie!', 'Cheers!', '¡Salud!'), 'Na zdrowié!', '¡Salud!', 'Salut!'],
        [T('Do widzenia', 'Goodbye', 'Adiós'), 'Do ùzdrzeniô', 'Adiós', 'Adéu']
      ], note: T('Kaszubski: język regionalny w Polsce (od 2005) · walencki: język współurzędowy w Walencji', 'Kashubian: a regional language in Poland (since 2005) · Valencian: co-official in the Valencian Community', 'Casubio: lengua regional en Polonia (desde 2005) · valenciano: lengua cooficial en la Comunidad Valenciana') },
      { k: 'rhythm', h: T('Rytm dnia', 'Daily rhythm', 'El ritmo del día'),
        meals: [
          { i: '🍽️', l: T('Obiad', 'Lunch', 'Comida'), ksz: [13, 14], es: [14, 15.5] },
          { i: '🌙', l: T('Kolacja', 'Dinner', 'Cena'), ksz: [18, 19], es: [21, 22] }
        ],
        cards: [
          { i: '🛒', l: T('Sklepy', 'Shops', 'Tiendas'), ksz: T('otwarte cały dzień', 'open all day', 'abiertas todo el día'), es: T('przerwa na sjestę (ok. 14–17) w małych miastach', 'siesta break (about 2–5 pm) in small towns', 'cierre de siesta (14–17 h aprox.) en pueblos') },
          { i: '🌡️', l: T('Pogoda w październiku', 'October weather', 'Tiempo en octubre'), ksz: T('ok. 10°C', 'about 10°C', 'unos 10°C'), es: T('ok. 23°C', 'about 23°C', 'unos 23°C') }
        ] },
      { k: 'unite', h: T('Co nas łączy', 'What we share', 'Lo que compartimos'), img: 'img/unity.svg', items: [
        { i: '🗣️', h: T('Własny język', 'A language of our own', 'Una lengua propia'), a: T('kaszubski obok polskiego', 'Kashubian next to Polish', 'casubio junto al polaco'), b: T('walencki obok hiszpańskiego', 'Valencian next to Spanish', 'valenciano junto al castellano') },
        { i: '🎉', h: T('Święta całej wspólnoty', 'Community festivals', 'Fiestas de todo el pueblo'), a: T('dożynki (òżniwinë)', 'harvest festival (òżniwinë)', 'fiesta de la cosecha'), b: T('Hogueras, Moros y Cristianos', 'Hogueras, Moros y Cristianos', 'Hogueras, Moros y Cristianos') },
        { i: '🤝', h: T('Ludzie razem', 'People together', 'Gente unida'), a: T('koła gospodyń wiejskich', 'rural women’s circles', 'asociaciones de mujeres rurales'), b: T('stowarzyszenia i comparsas', 'associations and comparsas', 'asociaciones y comparsas') },
        { i: '🧵', h: T('Rękodzieło', 'Crafts', 'Artesanía'), a: T('haft kaszubski', 'Kashubian embroidery', 'bordado casubio'), b: T('ceramika i koronka', 'ceramics and lace', 'cerámica y encaje') }
      ], note: T('Ciekawostka: 28 grudnia w Ibi trwa Els Enfarinats – bitwa na mąkę i jajka', 'Fun fact: on 28 December Ibi holds Els Enfarinats – a flour and egg battle', 'Curiosidad: el 28 de diciembre Ibi celebra Els Enfarinats, batalla de harina y huevos') },
      { k: 'task', h: T('Tłumacz w aparacie', 'Camera translator', 'Traductor con la cámara'), screen: 'translate', icons: ['🌐', '📷', '🎙️'], li: [
        T('Otwórzcie Tłumacza Google → „Aparat”', 'Open Google Translate → “Camera”', 'Abrid Google Traductor → «Cámara»'),
        T('Nakierujcie tablet na hiszpańskie menu lub szyld', 'Point the tablet at a Spanish menu or sign', 'Apuntad a un menú o cartel en español'),
        T('Nagrajcie powitanie po kaszubsku dla Hiszpanów', 'Record a Kashubian greeting for our Spanish hosts', 'Grabad un saludo en casubio para los anfitriones')
      ] },
      { k: 'pins' },
      { k: 'end', h: T('Dziękujemy! ¡Gracias!', 'Thank you! ¡Gracias!', '¡Gracias! Dziękujemy!') }
    ]
  },
  {
    id: 'p4', title: T('Dezinformacja: jak nie dać się nabrać', 'Disinformation: how not to be fooled', 'Desinformación: cómo no dejarse engañar'),
    slides: [
      { k: 'title', kicker: T('Prezentacja 2', 'Presentation 2', 'Presentación 2'), h: T('Nie daj się nabrać!', "Don't get fooled!", '¡Que no te engañen!'), p: T('Fake newsy, deepfake i sztuczna inteligencja', 'Fake news, deepfakes and artificial intelligence', 'Bulos, deepfakes e inteligencia artificial'), img: 'img/phone.jpg' },
      { k: 'text', h: T('Czym jest dezinformacja?', 'What is disinformation?', '¿Qué es la desinformación?'), li: [
        T('Fałszywa informacja szerzona celowo: dla pieniędzy, polityki albo kliknięć', 'False information spread on purpose: for money, politics or clicks', 'Información falsa difundida a propósito: por dinero, política o clics'),
        T('Działa, bo budzi emocje: strach, złość, oburzenie', 'It works because it triggers emotions: fear, anger, outrage', 'Funciona porque despierta emociones: miedo, rabia, indignación'),
        T('Najszybciej rozchodzi się przez znajomych i rodzinę', 'It spreads fastest through friends and family', 'Se difunde más rápido a través de amigos y familia')
      ] },
      { k: 'post', text: T('PILNE!!! Od jutra UE ZAKAZUJE kiszenia ogórków w domu! Udostępnij, zanim to usuną!!!', 'URGENT!!! From tomorrow the EU BANS home-made pickles! Share before they delete this!!!', '¡¡¡URGENTE!!! ¡Desde mañana la UE PROHÍBE hacer conservas en casa! ¡¡Comparte antes de que lo borren!!'), img: 'img/ogorki.jpg', stamp: T('ZAKAZ UE', 'EU BAN', 'PROHIBIDO UE'), note: T('Przykład wymyślony na potrzeby zajęć', 'A made-up example for this class', 'Ejemplo inventado para la clase') },
      { k: 'stop', h: T('STOP: 4 kroki przed udostępnieniem', 'STOP: 4 steps before you share', 'STOP: 4 pasos antes de compartir'), items: [
        { l: 'S', h: T('Spokój', 'Slow down', 'Serenidad'), p: T('Silne emocje to sygnał ostrzegawczy', 'Strong emotions are a warning sign', 'Las emociones fuertes son una alerta'), i: '😮‍💨' },
        { l: 'T', h: T('Kto to napisał?', 'Who wrote it?', '¿Quién lo escribió?'), p: T('Jest autor, data, źródło?', 'Is there an author, a date, a source?', '¿Hay autor, fecha, fuente?'), i: '🔎' },
        { l: 'O', h: T('Inne źródła', 'Other sources', 'Otras fuentes'), p: T('Czy podają to radio, TV, gazety?', 'Do radio, TV or papers report it?', '¿Lo dicen la radio, la tele, la prensa?'), i: '📰' },
        { l: 'P', h: T('Pokaż zdjęcie Google Lens', 'Put the photo into Google Lens', 'Pasa la foto por Google Lens'), p: T('Skąd naprawdę pochodzi?', 'Where is it really from?', '¿De dónde viene de verdad?'), i: '📷' }
      ] },
      { k: 'task', h: T('Detektyw zdjęć', 'Photo detective', 'Detective de fotos'), screen: 'lens', icons: ['📸', '🔍', '📍'], img: 'img/valor-shop.jpg', li: [
        T('Zróbcie tabletem zdjęcie tego obrazka na ekranie', 'Take a photo of this picture on the screen with the tablet', 'Haced una foto de esta imagen con la tableta'),
        T('Google Lens lub aplikacja Google → ikona aparatu', 'Google Lens or the Google app → camera icon', 'Google Lens o la app de Google → icono de cámara'),
        T('Gdzie i co to jest? Podajcie miasto i nazwę', 'Where and what is it? Name the town and the place', '¿Qué es y dónde está? Decid ciudad y nombre')
      ] },
      { k: 'text', h: T('Deepfake: „Babciu, to ja!”', 'Deepfake: “Grandma, it’s me!”', 'Deepfake: «¡Abuela, soy yo!»'), video: 'Qoruwv2C_Xo', videoSrc: 'Uwaga! TVN · YouTube', li: [
        T('AI potrafi podrobić twarz i głos bliskiej osoby z kilku sekund nagrania', 'AI can fake a loved one’s face and voice from a few seconds of recording', 'La IA puede imitar la cara y la voz de un ser querido con unos segundos de grabación'),
        T('Oszuści biorą nagrania z Facebooka czy TikToka', 'Scammers take recordings from Facebook or TikTok', 'Los estafadores usan grabaciones de Facebook o TikTok'),
        T('Fałszywe reklamy „inwestycji” ze znanymi osobami', 'Fake “investment” ads with famous people', 'Anuncios falsos de «inversión» con famosos')
      ] },
      { k: 'task', h: T('Złap AI na błędzie', 'Catch the AI out', 'Pilla a la IA'), screen: 'ai', icons: ['🤖', '✍️', '🕵️'], li: [
        T('Otwórzcie na tablecie Copilota lub ChatGPT', 'Open Copilot or ChatGPT on the tablet', 'Abrid Copilot o ChatGPT en la tableta'),
        T('Napiszcie: „kaszubska babcia w hafcie na plaży w Alicante”', 'Type: “Kashubian grandma in embroidery on the beach in Alicante”', 'Escribid: «abuela casubia con bordado en la playa de Alicante»'),
        T('Szukajcie błędów: dłonie, napisy, cienie, tło', 'Look for mistakes: hands, writing, shadows, background', 'Buscad fallos: manos, letras, sombras, fondo')
      ] },
      { k: 'results' },
      { k: 'end', h: T('Myśl, zanim udostępnisz!', 'Think before you share!', '¡Piensa antes de compartir!') }
    ]
  },
  {
    id: 'p5', title: T('Bezpieczeństwo w sieci', 'Staying safe online', 'Seguridad en internet'),
    slides: [
      { k: 'title', kicker: T('Prezentacja 3', 'Presentation 3', 'Presentación 3'), h: T('Bezpieczni w sieci', 'Safe online', 'Seguros en internet'), p: T('Oszustwa, hasła i jak się bronić', 'Scams, passwords and how to protect yourself', 'Estafas, contraseñas y cómo protegerse'), img: 'img/laptop.jpg' },
      { k: 'scams', h: T('Najczęstsze oszustwa', 'The most common scams', 'Las estafas más comunes'), items: [
        { kind: 'sms', from: '+48 731 *** ***', msg: T('Twoja paczka czeka. Dopłać 1,99 zł: paczka-doplata.co', 'Your parcel is waiting. Pay €0.99: parcel-fee.co', 'Tu paquete te espera. Paga 0,99 €: paquete-pago.co'), l: T('SMS „dopłata do paczki”', 'Text: “parcel fee”', 'SMS: «pago de paquete»') },
        { kind: 'call', from: T('Wnuczek ❤️', 'Grandson ❤️', 'Nieto ❤️'), l: T('Telefon „na wnuczka” lub „z banku”', 'Call “from your grandchild” or “the bank”', 'Llamada «del nieto» o «del banco»') },
        { kind: 'chat', msgs: [T('Mamo, zgubiłem telefon 😥', 'Mum, I lost my phone 😥', 'Mamá, perdí el móvil 😥'), T('To mój nowy numer', 'This is my new number', 'Este es mi nuevo número'), T('Pilnie potrzebuję 800 zł, oddam jutro', 'I urgently need €200, I’ll pay you back tomorrow', 'Necesito 200 € urgente, te los devuelvo mañana')], l: T('„Mamo, to mój nowy numer”', '“Mum, this is my new number”', '«Mamá, este es mi nuevo número»') },
        { kind: 'ad', head: T('Zarabiaj 5000 zł dziennie!', 'Earn €1,000 a day!', '¡Gana 1.000 € al día!'), btn: T('INWESTUJ TERAZ', 'INVEST NOW', 'INVIERTE YA'), l: T('Reklamy „pewnych inwestycji” z deepfake', '“Sure investment” deepfake ads', 'Anuncios de «inversión segura» con deepfakes') }
      ] },
      { k: 'post', text: T('Twoja paczka czeka. Dopłać 1,99 zł: paczka-doplata.co', 'Your parcel is waiting. Pay €0.99: parcel-fee.co', 'Tu paquete te espera. Paga 0,99 €: paquete-pago.co'), note: T('Przykład wymyślony na potrzeby zajęć: nie klikamy!', 'A made-up example: never click!', 'Ejemplo inventado: ¡no pinches!'), sms: true },
      { k: 'text', h: T('5 zasad do zapamiętania', '5 rules to remember', '5 reglas para recordar'), li: [
        T('Nie klikam w linki z SMS-ów i maili', "I don't click links in texts and emails", 'No pincho enlaces de SMS ni correos'),
        T('Sam dzwonię na znany numer: banku, dziecka, urzędu', 'I call a number I know myself: the bank, my child, the office', 'Llamo yo a un número conocido: banco, hijo, oficina'),
        T('Hasło = długie zdanie, a do tego kod z SMS-a (2FA)', 'Password = a long sentence, plus an SMS code (2FA)', 'Contraseña = frase larga, más código por SMS (2FA)'),
        T('Nikomu nie podaję kodów BLIK ani kodów z SMS', 'I never give anyone payment or SMS codes', 'Nunca doy códigos de pago ni de SMS'),
        T('Mamy rodzinne słowo-hasło na „pilne” telefony', 'Our family has a code word for “urgent” calls', 'En familia tenemos una palabra clave para llamadas «urgentes»')
      ] },
      { k: 'task', h: T('Zabezpieczcie tablet', 'Secure the tablet', 'Proteged la tableta'), screen: 'secure', icons: ['🔒', '📍', '🔄'], li: [
        T('Ustawienia → Face ID / kod: czy blokada jest włączona?', 'Settings → Face ID / passcode: is the lock on?', 'Ajustes → Face ID / código: ¿está activado el bloqueo?'),
        T('Ustawienia → Prywatność → Lokalizacja: które aplikacje widzą, gdzie jesteś?', 'Settings → Privacy → Location: which apps know where you are?', 'Ajustes → Privacidad → Localización: ¿qué apps saben dónde estás?'),
        T('Sprawdźcie, czy system ma aktualizację', 'Check whether there is a system update', 'Comprobad si hay actualización del sistema')
      ] },
      { k: 'cert' },
      { k: 'credits' },
      { k: 'end', h: T('Dziękujemy! Dzãkùjemë! ¡Gracias!', 'Thank you! Dzãkùjemë! ¡Gracias!', '¡Gracias! Dzãkùjemë! Dziękujemy!') }
    ]
  },
  {
    id: 'survey', title: T('Ankieta przed/po: dezinformacja', 'Before/after survey: disinformation', 'Encuesta antes/después: desinformación'),
    slides: [
      { k: 'title', kicker: T('Ewaluacja projektu', 'Project evaluation', 'Evaluación del proyecto'), h: T('Ankieta: dezinformacja', 'Survey: disinformation', 'Encuesta: desinformación'), p: T('10 pytań · anonimowo · ten sam kod przed i po', '10 questions · anonymous · same code before and after', '10 preguntas · anónima · mismo código antes y después'), img: 'img/phone.jpg' },
      { k: 'survey', phase: 'pre' },
      { k: 'survey', phase: 'post' },
      { k: 'problem' },
      { k: 'results' },
      { k: 'confidence' },
      { k: 'people' },
      { k: 'evaluation' },
      { k: 'teams' }
    ]
  }
];
