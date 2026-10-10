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

// Questions. `ok` = index of the correct answer (quiz); no `ok` = opinion poll.
window.Q = {
  p1_from: { q: T('Skąd jesteście?', 'Where are you from?', '¿De dónde sois?'), a: [T('Nakla', 'Nakla', 'Nakla'), T('Parchowo', 'Parchowo', 'Parchowo'), T('Sylczno', 'Sylczno', 'Sylczno'), T('Z innej wsi', 'Another village', 'Otro pueblo')] },
  p1_pay: { q: T('Kto płaci za ten wyjazd?', 'Who pays for this trip?', '¿Quién paga este viaje?'), a: [T('Sami uczestnicy', 'The participants', 'Los participantes'), T('Unia Europejska – Erasmus+', 'The European Union – Erasmus+', 'La Unión Europea – Erasmus+'), T('Gmina', 'The local council', 'El ayuntamiento'), T('Biuro podróży', 'A travel agency', 'Una agencia de viajes')], ok: 1 },
  p1_count: { q: T('Ilu słuchaczy fundacji przyjechało do Hiszpanii?', 'How many learners came to Spain?', '¿Cuántos alumnos vinieron a España?'), a: [T('18', '18', '18'), T('28', '28', '28'), T('38', '38', '38'), T('48', '48', '48')], ok: 1 },
  p1_fear: { q: T('Czego najbardziej obawiacie się w internecie?', 'What worries you most online?', '¿Qué os preocupa más en internet?'), a: [T('Oszustw i kradzieży pieniędzy', 'Scams and stolen money', 'Estafas y robo de dinero'), T('Fałszywych wiadomości', 'Fake news', 'Noticias falsas'), T('Sztucznej inteligencji', 'Artificial intelligence', 'La inteligencia artificial'), T('Niczego się nie boję', "I'm not worried", 'No me preocupa nada')] },

  p2_ibi: { q: T('Z czego słynie Ibi?', 'What is Ibi famous for?', '¿Por qué es famosa Ibi?'), a: [T('Z zabawek', 'Toys', 'Los juguetes'), T('Z czekolady', 'Chocolate', 'El chocolate'), T('Z wina', 'Wine', 'El vino'), T('Z połowu ryb', 'Fishing', 'La pesca')], ok: 0 },
  p2_palms: { q: T('Ile palm rośnie w Palmeral w Elche?', 'How many palms grow in the Palmeral of Elche?', '¿Cuántas palmeras hay en el Palmeral de Elche?'), a: [T('około 2 000', 'about 2,000', 'unas 2.000'), T('około 20 000', 'about 20,000', 'unas 20.000'), T('ponad 200 000', 'over 200,000', 'más de 200.000'), T('około 2 milionów', 'about 2 million', 'unos 2 millones')], ok: 2 },
  p2_valor: { q: T('W którym mieście jest fabryka czekolady Valor?', 'Which town is home to the Valor chocolate factory?', '¿En qué ciudad está la fábrica de chocolate Valor?'), a: [T('Alicante', 'Alicante', 'Alicante'), T('Villajoyosa', 'Villajoyosa', 'Villajoyosa'), T('Elche', 'Elche', 'Elche'), T('Ibi', 'Ibi', 'Ibi')], ok: 1 },
  p2_best: { q: T('Która wycieczka podobała się Wam najbardziej?', 'Which trip did you like most?', '¿Qué excursión os gustó más?'), a: [T('Alicante z przewodnikiem', 'Alicante guided tour', 'Alicante con guía'), T('Villajoyosa i Valor', 'Villajoyosa and Valor', 'Villajoyosa y Valor'), T('Elche – Park Palmowy', 'Elche – Palm Grove', 'Elche – Palmeral'), T('Gra miejska', 'City game', 'Juego urbano')] },

  p3_haft: { q: T('Kaszuby czy Walencja?', 'Kashubia or Valencia?', '¿Casubia o Valencia?'), a: [T('Kaszuby', 'Kashubia', 'Casubia'), T('Walencja', 'Valencia', 'Valencia'), T('Jedno i drugie', 'Both', 'Las dos')], ok: 0, img: 'img/haft.jpg' },
  p3_paella: { q: T('Kaszuby czy Walencja?', 'Kashubia or Valencia?', '¿Casubia o Valencia?'), a: [T('Kaszuby', 'Kashubia', 'Casubia'), T('Walencja', 'Valencia', 'Valencia'), T('Jedno i drugie', 'Both', 'Las dos')], ok: 1, img: 'img/paella.jpg' },
  p3_wieniec: { q: T('Kaszuby czy Walencja?', 'Kashubia or Valencia?', '¿Casubia o Valencia?'), a: [T('Kaszuby', 'Kashubia', 'Casubia'), T('Walencja', 'Valencia', 'Valencia'), T('Jedno i drugie', 'Both', 'Las dos')], ok: 0, img: 'img/dozynki.jpg' },
  p3_ogien: { q: T('Kaszuby czy Walencja?', 'Kashubia or Valencia?', '¿Casubia o Valencia?'), a: [T('Kaszuby', 'Kashubia', 'Casubia'), T('Walencja', 'Valencia', 'Valencia'), T('Jedno i drugie', 'Both', 'Las dos')], ok: 1, img: 'img/hogueras.jpg' },
  p3_lang: { q: T('Gdzie mówi się w języku regionalnym obok języka państwowego?', 'Where is a regional language spoken alongside the national one?', '¿Dónde se habla una lengua regional junto a la nacional?'), a: [T('Na Kaszubach', 'In Kashubia', 'En Casubia'), T('W Walencji', 'In Valencia', 'En Valencia'), T('W obu miejscach', 'In both', 'En los dos')], ok: 2 },
  p3_enfar: { q: T('Co robią mieszkańcy Ibi 28 grudnia (Els Enfarinats)?', 'What do people in Ibi do on 28 December (Els Enfarinats)?', '¿Qué hacen en Ibi el 28 de diciembre (Els Enfarinats)?'), a: [T('Bitwę na mąkę i jajka', 'A flour and egg battle', 'Una batalla de harina y huevos'), T('Wyścig osłów', 'A donkey race', 'Una carrera de burros'), T('Kolędują po domach', 'Sing carols door to door', 'Cantan villancicos casa por casa')], ok: 0 },
  p3_surprise: { q: T('Co Was najbardziej zaskoczyło w Hiszpanii?', 'What surprised you most in Spain?', '¿Qué os sorprendió más de España?'), a: [T('Późne godziny posiłków', 'Late meal times', 'Los horarios de comida'), T('Pogoda', 'The weather', 'El tiempo'), T('Ludzie', 'The people', 'La gente'), T('Jedzenie', 'The food', 'La comida')] },

  dz1: { q: T('Zdjęcie w internecie zawsze pokazuje prawdę.', 'A photo on the internet always shows the truth.', 'Una foto en internet siempre muestra la verdad.'), a: [T('Prawda', 'True', 'Verdadero'), T('Fałsz', 'False', 'Falso')], ok: 1 },
  dz2: { q: T('Co sprawdzić najpierw przy sensacyjnej wiadomości?', 'What should you check first in a shocking news story?', '¿Qué compruebas primero en una noticia impactante?'), a: [T('Źródło i datę', 'The source and the date', 'La fuente y la fecha'), T('Liczbę polubień', 'The number of likes', 'El número de «me gusta»'), T('Czy udostępnił ją znajomy', 'Whether a friend shared it', 'Si la compartió un amigo')], ok: 0 },
  dz3: { q: T('Deepfake to…', 'A deepfake is…', 'Un deepfake es…'), a: [T('fałszywe nagranie lub zdjęcie zrobione przez AI', 'a fake video or photo made by AI', 'un vídeo o foto falsa hecha con IA'), T('wirus komputerowy', 'a computer virus', 'un virus informático'), T('rodzaj reklamy', 'a kind of advert', 'un tipo de anuncio')], ok: 0 },
  dz_signal: { q: T('Co w tym poście jest sygnałem manipulacji?', 'What in this post signals manipulation?', '¿Qué en esta publicación indica manipulación?'), a: [T('„PILNE!” i wielkie litery', '“URGENT!” and capital letters', '«¡URGENTE!» y mayúsculas'), T('„Udostępnij, zanim usuną”', '“Share before they delete it”', '«Comparte antes de que lo borren»'), T('Brak źródła', 'No source', 'No hay fuente'), T('Wszystko powyżej', 'All of the above', 'Todo lo anterior')], ok: 3 },
  dz_voice: { q: T('Ile nagrania głosu potrzebuje AI, żeby go podrobić?', 'How much voice recording does AI need to clone a voice?', '¿Cuánta grabación necesita la IA para clonar una voz?'), a: [T('Kilka sekund', 'A few seconds', 'Unos segundos'), T('Godzinę', 'One hour', 'Una hora'), T('Cały dzień', 'A whole day', 'Un día entero')], ok: 0 },
  dz_share: { q: T('Czy przed udostępnieniem sprawdzisz źródło?', 'Will you check the source before sharing?', '¿Comprobarás la fuente antes de compartir?'), a: [T('Tak, zawsze', 'Yes, always', 'Sí, siempre'), T('Czasami', 'Sometimes', 'A veces'), T('Nie', 'No', 'No')] },

  bz1: { q: T('Bank prosi SMS-em o kliknięcie w link i podanie hasła. Co robisz?', 'Your bank texts you a link asking for your password. What do you do?', 'Tu banco te envía un SMS con un enlace pidiendo tu contraseña. ¿Qué haces?'), a: [T('Klikam i loguję się', 'Click and log in', 'Pincho y entro'), T('Nie klikam, dzwonię do banku na znany numer', "Don't click, call the bank on a known number", 'No pincho, llamo al banco a un número conocido'), T('Odpisuję na SMS', 'Reply to the text', 'Respondo al SMS')], ok: 1 },
  bz2: { q: T('Najlepsze hasło to…', 'The best password is…', 'La mejor contraseña es…'), a: [T('imię wnuczka', "a grandchild's name", 'el nombre de un nieto'), T('123456', '123456', '123456'), T('długie zdanie z kilku słów', 'a long sentence of several words', 'una frase larga de varias palabras')], ok: 2 },
  bz3: { q: T('Kod BLIK lub kod z SMS możesz podać…', 'A one-time payment or SMS code can be given…', 'Un código de pago o de SMS se puede dar…'), a: [T('pracownikowi banku przez telefon', 'to a bank employee on the phone', 'a un empleado del banco por teléfono'), T('nikomu – wpisujesz go tylko sam', 'to nobody – you type it yourself', 'a nadie, solo lo escribes tú'), T('znajomemu z Messengera', 'to a friend on Messenger', 'a un amigo por Messenger')], ok: 1 },
  bz_sms1: { q: T('„Twoja paczka czeka. Dopłać 1,99 zł: paczka-doplata.co” – oszustwo czy prawda?', '“Your parcel is waiting. Pay €0.99: parcel-fee.co” – scam or real?', '«Tu paquete te espera. Paga 0,99 €: paquete-pago.co» – ¿estafa o real?'), a: [T('Oszustwo', 'Scam', 'Estafa'), T('Prawdziwe', 'Real', 'Real')], ok: 0 },
  bz_sms2: { q: T('„Mamo, zgubiłem telefon, to mój nowy numer. Pilnie potrzebuję 800 zł” – co robisz?', '“Mum, I lost my phone, this is my new number. I urgently need €200” – what do you do?', '«Mamá, perdí el móvil, este es mi nuevo número. Necesito 200 € urgente» – ¿qué haces?'), a: [T('Przelewam od razu', 'Send the money', 'Hago la transferencia'), T('Dzwonię na stary numer dziecka', "Call my child's old number", 'Llamo al número antiguo de mi hijo'), T('Odpisuję z pytaniem', 'Text back a question', 'Respondo con una pregunta')], ok: 1 },
  bz_word: { q: T('Czy ustalicie z rodziną słowo-hasło na wypadek fałszywego telefonu?', 'Will you agree a family code word against fake calls?', '¿Acordaréis una palabra clave familiar contra llamadas falsas?'), a: [T('Tak', 'Yes', 'Sí'), T('Nie', 'No', 'No'), T('Już mamy', 'We already have one', 'Ya tenemos una')] }
};

// Slide kinds: title, join, text, img, compare, map, table, q (question), task, score, prepost, cert, end, credits.
window.DECKS = [
  {
    id: 'p1', title: T('Kaszëbi w Europie! Wprowadzenie', 'Kashubians in Europe! Introduction', '¡Casubios en Europa! Introducción'),
    slides: [
      { k: 'title', kicker: T('Erasmus+ · Edukacja dorosłych', 'Erasmus+ · Adult education', 'Erasmus+ · Educación de adultos'), h: T('KASZËBI W EUROPIE!', 'KASZËBI IN EUROPE!', '¡CASUBIOS EN EUROPA!'), p: T('Rzetelna i nowoczesna edukacja cyfrowa na terenach wiejskich · Ibi i Alicante, 11–21.10.2026', 'Reliable, modern digital education in rural areas · Ibi and Alicante, 11–21 Oct 2026', 'Educación digital fiable y moderna en zonas rurales · Ibi y Alicante, 11–21 oct 2026'), img: 'img/alicante.jpg' },
      { k: 'join' },
      { k: 'q', q: 'p1_from' },
      { k: 'text', h: T('Kim jesteśmy', 'Who we are', 'Quiénes somos'), img: 'img/kaszuby.jpg', li: [
        T('Fundacja Kaszëbi we swiecë, wieś Nakla (ok. 400 mieszkańców), powiat bytowski', 'Kaszëbi we swiecë Foundation, Nakla village (about 400 people), Bytów county, Poland', 'Fundación Kaszëbi we swiecë, pueblo de Nakla (unos 400 habitantes), Polonia'),
        T('Ok. 120 stałych słuchaczy: koła gospodyń wiejskich, seniorzy', 'About 120 regular adult learners: rural women’s circles, seniors', 'Unos 120 alumnos adultos: asociaciones de mujeres rurales, mayores'),
        T('Zajęcia komputerowe, językowe i kulturowe – bezpłatnie', 'Free computer, language and culture classes', 'Clases gratuitas de informática, idiomas y cultura'),
        T('Wcześniej: Teneryfa 2024, „Kaszëbi w Europie” 2025, partnerstwo ze Słowacją', 'Before: Tenerife 2024, “Kaszëbi w Europie” 2025, partnership with Slovakia', 'Antes: Tenerife 2024, «Kaszëbi w Europie» 2025, asociación con Eslovaquia')
      ] },
      { k: 'q', q: 'p1_pay' },
      { k: 'text', h: T('Nasz projekt', 'Our project', 'Nuestro proyecto'), img: 'img/tablet.jpg', li: [
        T('28 słuchaczy z terenów wiejskich + 3 opiekunów', '28 learners from rural areas + 3 companions', '28 alumnos de zonas rurales + 3 acompañantes'),
        T('Partner: Associació Blue Beehive z Ibi', 'Host: Associació Blue Beehive, Ibi', 'Socio: Associació Blue Beehive de Ibi'),
        T('Uczymy się: tablety i AI, rozpoznawanie fake newsów, bezpieczeństwo w sieci, angielski', 'We learn: tablets and AI, spotting fake news, online safety, English', 'Aprendemos: tabletas e IA, detectar bulos, seguridad en internet, inglés'),
        T('Po powrocie: 10 warsztatów dla kolejnych 25 osób z regionu', 'Back home: 10 workshops for 25 more people from the region', 'A la vuelta: 10 talleres para 25 personas más de la región')
      ] },
      { k: 'map', h: T('Z Kaszub do Alicante', 'From Kashubia to Alicante', 'De Casubia a Alicante'), bbox: '-4.5,36.5,22,56', marker: '38.63,-0.57', p: T('Gdańsk → Alicante: ok. 2 300 km, ok. 3,5 h lotu', 'Gdańsk → Alicante: about 2,300 km, about 3.5 h flight', 'Gdańsk → Alicante: unos 2.300 km, unas 3,5 h de vuelo') },
      { k: 'table', h: T('Program 11 dni', 'Our 11-day programme', 'Programa de 11 días'), rows: [
        [T('11.10', '11 Oct', '11 oct'), T('Przylot do Alicante', 'Arrival in Alicante', 'Llegada a Alicante')],
        [T('12.10', '12 Oct', '12 oct'), T('Alicante z przewodnikiem', 'Alicante guided tour', 'Alicante con guía')],
        [T('13.10', '13 Oct', '13 oct'), T('Warsztaty · Muzeum Ognia', 'Workshops · Fire Museum', 'Talleres · Museo del Fuego')],
        [T('14.10', '14 Oct', '14 oct'), T('Villajoyosa i fabryka czekolady Valor', 'Villajoyosa and the Valor chocolate factory', 'Villajoyosa y la fábrica Valor')],
        [T('15.10', '15 Oct', '15 oct'), T('Warsztaty · gra miejska', 'Workshops · city game', 'Talleres · juego urbano')],
        [T('16.10', '16 Oct', '16 oct'), T('Warsztaty', 'Workshops', 'Talleres')],
        [T('17.10', '17 Oct', '17 oct'), T('Koncert zespołu Modraki', 'Modraki band concert', 'Concierto del grupo Modraki')],
        [T('18.10', '18 Oct', '18 oct'), T('Elche – Park Palmowy', 'Elche – Palm Grove', 'Elche – Palmeral')],
        [T('19.10', '19 Oct', '19 oct'), T('Warsztaty', 'Workshops', 'Talleres')],
        [T('20.10', '20 Oct', '20 oct'), T('Quiz podsumowujący', 'Final quiz', 'Quiz final')],
        [T('21.10', '21 Oct', '21 oct'), T('Powrót do Gdańska', 'Flight back to Gdańsk', 'Vuelta a Gdańsk')]
      ] },
      { k: 'q', q: 'p1_count' },
      { k: 'task', h: T('Zmierzcie odległość', 'Measure the distance', 'Medid la distancia'), li: [
        T('Otwórzcie Mapy Google na tablecie', 'Open Google Maps on the tablet', 'Abrid Google Maps en la tableta'),
        T('Znajdźcie Naklę, przytrzymajcie palec → „Zmierz odległość”', 'Find Nakla, press and hold → “Measure distance”', 'Buscad Nakla, mantened pulsado → «Medir distancia»'),
        T('Przesuńcie mapę do Ibi. Ile kilometrów?', 'Move the map to Ibi. How many kilometres?', 'Moved el mapa hasta Ibi. ¿Cuántos kilómetros?'),
        T('Najbliższy wynik = 3 punkty dla drużyny', 'Closest answer = 3 points for the team', 'La respuesta más cercana = 3 puntos')
      ] },
      { k: 'q', q: 'p1_fear' },
      { k: 'score' },
      { k: 'end', h: T('Dziękujemy! Do zobaczenia na warsztatach', 'Thank you! See you at the workshops', '¡Gracias! Nos vemos en los talleres') }
    ]
  },
  {
    id: 'p2', title: T('Gdzie jesteśmy? Ibi i Alicante', 'Where are we? Ibi and Alicante', '¿Dónde estamos? Ibi y Alicante'),
    slides: [
      { k: 'title', kicker: T('Prezentacja 2', 'Presentation 2', 'Presentación 2'), h: T('Gdzie jesteśmy?', 'Where are we?', '¿Dónde estamos?'), p: T('Ibi, Alicante i okolice', 'Ibi, Alicante and around', 'Ibi, Alicante y alrededores'), img: 'img/explanada.jpg' },
      { k: 'join' },
      { k: 'map', h: T('Prowincja Alicante', 'Province of Alicante', 'Provincia de Alicante'), bbox: '-1.0,38.2,0.0,38.8', marker: '38.63,-0.57', p: T('Ibi leży w górach, ok. 40 km od Alicante i morza', 'Ibi lies in the mountains, about 40 km from Alicante and the sea', 'Ibi está en la montaña, a unos 40 km de Alicante y del mar') },
      { k: 'img', img: 'img/ibi.jpg', h: T('Ibi', 'Ibi', 'Ibi'), p: T('Ok. 24 tys. mieszkańców, ok. 800 m n.p.m. Hiszpańska stolica zabawek.', 'About 24,000 people, about 800 m above sea level. Spain’s toy capital.', 'Unos 24.000 habitantes, unos 800 m de altitud. La capital española del juguete.') },
      { k: 'q', q: 'p2_ibi' },
      { k: 'img', img: 'img/fiesta_ibi.jpg', h: T('Muzeum Zabawek w Ibi', 'Toy Museum in Ibi', 'Museo Valenciano del Juguete'), p: T('Fabryki zabawek dały pracę całej okolicy przez ponad 100 lat.', 'Toy factories gave work to the whole area for over 100 years.', 'Las fábricas de juguetes dieron trabajo a toda la comarca durante más de 100 años.') },
      { k: 'img', img: 'img/alicante.jpg', h: T('Alicante – zamek Santa Bárbara', 'Alicante – Santa Bárbara Castle', 'Alicante – Castillo de Santa Bárbara'), p: T('Zamek na górze Benacantil, widok na całe miasto i port.', 'The castle on Mount Benacantil overlooks the city and port.', 'El castillo en el monte Benacantil domina la ciudad y el puerto.') },
      { k: 'img', img: 'img/explanada.jpg', h: T('Explanada de España', 'Explanada de España', 'Explanada de España'), p: T('Promenada z mozaiki ułożonej z ok. 6,5 mln kafelków.', 'A seafront promenade paved with about 6.5 million tiles.', 'Un paseo marítimo con unos 6,5 millones de teselas.') },
      { k: 'compare', a: { img: 'img/elche.jpg', h: T('Elche – Palmeral (UNESCO)', 'Elche – Palmeral (UNESCO)', 'Elche – Palmeral (UNESCO)') }, b: { img: 'img/villajoyosa.jpg', h: T('Villajoyosa – plaża i kolorowe domy', 'Villajoyosa – beach and colourful houses', 'Villajoyosa – playa y casas de colores') } },
      { k: 'q', q: 'p2_palms' },
      { k: 'img', img: 'img/valor.jpg', h: T('Czekolada Valor', 'Valor chocolate', 'Chocolates Valor'), p: T('Rodzinna firma z Villajoyosy, działa od 1881 roku.', 'A family business from Villajoyosa since 1881.', 'Empresa familiar de Villajoyosa desde 1881.') },
      { k: 'q', q: 'p2_valor' },
      { k: 'task', h: T('Spacer w Street View', 'A walk in Street View', 'Un paseo en Street View'), li: [
        T('Mapy Google → wpiszcie „Explanada de España”', 'Google Maps → type “Explanada de España”', 'Google Maps → escribid «Explanada de España»'),
        T('Przeciągnijcie żółtego ludzika na ulicę', 'Drag the yellow figure onto the street', 'Arrastrad el muñeco amarillo a la calle'),
        T('Znajdźcie morze i palmę, zróbcie zrzut ekranu', 'Find the sea and a palm, take a screenshot', 'Encontrad el mar y una palmera, haced una captura'),
        T('Kto pierwszy pokaże = 2 punkty', 'First to show it = 2 points', 'El primero en enseñarlo = 2 puntos')
      ] },
      { k: 'q', q: 'p2_best' },
      { k: 'score' },
      { k: 'end', h: T('¡Gracias! Dziękujemy!', '¡Gracias! Thank you!', '¡Gracias! Dziękujemy!') }
    ]
  },
  {
    id: 'p3', title: T('Kaszuby i Walencja: różnice i podobieństwa', 'Kashubia and Valencia: differences and similarities', 'Casubia y Valencia: diferencias y semejanzas'),
    slides: [
      { k: 'title', kicker: T('Prezentacja 3', 'Presentation 3', 'Presentación 3'), h: T('Kaszuby i Walencja', 'Kashubia and Valencia', 'Casubia y Valencia'), p: T('Co nas różni, a co łączy?', 'What makes us different, what do we share?', '¿Qué nos diferencia y qué compartimos?'), img: 'img/kaszuby.jpg' },
      { k: 'join' },
      { k: 'compare', a: { img: 'img/kaszuby.jpg', h: T('Kaszuby: jeziora i lasy', 'Kashubia: lakes and forests', 'Casubia: lagos y bosques') }, b: { img: 'img/villajoyosa.jpg', h: T('Walencja: góry i morze', 'Valencia: mountains and sea', 'Valencia: montaña y mar') } },
      { k: 'q', q: 'p3_haft' },
      { k: 'q', q: 'p3_paella' },
      { k: 'q', q: 'p3_wieniec' },
      { k: 'q', q: 'p3_ogien' },
      { k: 'table', h: T('Język', 'Language', 'Lengua'), rows: [
        [T('', '', ''), T('Kaszuby · Walencja', 'Kashubia · Valencia', 'Casubia · Valencia')],
        [T('Dzień dobry', 'Good morning', 'Buenos días'), T('Dobri dzéń · Bon dia', 'Dobri dzéń · Bon dia', 'Dobri dzéń · Bon dia')],
        [T('Dziękuję', 'Thank you', 'Gracias'), T('Dzãkùjã · Gràcies', 'Dzãkùjã · Gràcies', 'Dzãkùjã · Gràcies')],
        [T('Status', 'Status', 'Estatus'), T('język regionalny (od 2005) · język współurzędowy', 'regional language (since 2005) · co-official language', 'lengua regional (desde 2005) · lengua cooficial')]
      ] },
      { k: 'q', q: 'p3_lang' },
      { k: 'table', h: T('Rytm dnia', 'Daily rhythm', 'El ritmo del día'), rows: [
        [T('', '', ''), T('Kaszuby · Hiszpania', 'Kashubia · Spain', 'Casubia · España')],
        [T('Obiad', 'Lunch', 'Comida'), T('ok. 13:00 · 14:00–15:30', 'about 1 pm · 2–3:30 pm', 'hacia las 13:00 · 14:00–15:30')],
        [T('Kolacja', 'Dinner', 'Cena'), T('ok. 18:00 · 21:00–22:00', 'about 6 pm · 9–10 pm', 'hacia las 18:00 · 21:00–22:00')],
        [T('Sklepy', 'Shops', 'Tiendas'), T('cały dzień · przerwa na sjestę w małych miastach', 'open all day · siesta break in small towns', 'todo el día · cierre a mediodía en pueblos')],
        [T('Pogoda w październiku', 'October weather', 'Tiempo en octubre'), T('ok. 10°C · ok. 23°C', 'about 10°C · about 23°C', 'unos 10°C · unos 23°C')]
      ] },
      { k: 'text', h: T('Co nas łączy', 'What we share', 'Lo que compartimos'), img: 'img/dozynki.jpg', li: [
        T('Duma z regionu i własny język obok języka państwowego', 'Pride in our region and a language of our own', 'Orgullo regional y una lengua propia'),
        T('Święta całej wspólnoty: dożynki ↔ Hogueras, Moros y Cristianos', 'Community festivals: harvest festival ↔ Hogueras, Moros y Cristianos', 'Fiestas de todo el pueblo: dożynki ↔ Hogueras, Moros y Cristianos'),
        T('Koła gospodyń ↔ stowarzyszenia i bractwa świąteczne', 'Rural women’s circles ↔ local associations and festival groups', 'Asociaciones de mujeres ↔ asociaciones y comparsas'),
        T('Rękodzieło: haft kaszubski ↔ ceramika i koronka', 'Crafts: Kashubian embroidery ↔ ceramics and lace', 'Artesanía: bordado casubio ↔ cerámica y encaje')
      ] },
      { k: 'q', q: 'p3_enfar' },
      { k: 'task', h: T('Tłumacz w aparacie', 'Camera translator', 'Traductor con la cámara'), li: [
        T('Otwórzcie Tłumacza Google → „Aparat”', 'Open Google Translate → “Camera”', 'Abrid Google Traductor → «Cámara»'),
        T('Nakierujcie tablet na hiszpańskie menu lub szyld', 'Point the tablet at a Spanish menu or sign', 'Apuntad a un menú o cartel en español'),
        T('Nagrajcie powitanie po kaszubsku dla Hiszpanów', 'Record a Kashubian greeting for our Spanish hosts', 'Grabad un saludo en casubio para los anfitriones'),
        T('Najlepsze nagranie = 3 punkty', 'Best recording = 3 points', 'La mejor grabación = 3 puntos')
      ] },
      { k: 'q', q: 'p3_surprise' },
      { k: 'score' },
      { k: 'end', h: T('Dzãkùjemë! ¡Gracias! Dziękujemy!', 'Dzãkùjemë! ¡Gracias! Thank you!', 'Dzãkùjemë! ¡Gracias! Dziękujemy!') }
    ]
  },
  {
    id: 'p4', title: T('Dezinformacja: jak nie dać się nabrać', 'Disinformation: how not to be fooled', 'Desinformación: cómo no dejarse engañar'),
    slides: [
      { k: 'title', kicker: T('Prezentacja 4', 'Presentation 4', 'Presentación 4'), h: T('Nie daj się nabrać!', "Don't get fooled!", '¡Que no te engañen!'), p: T('Fake newsy, deepfake i sztuczna inteligencja', 'Fake news, deepfakes and artificial intelligence', 'Bulos, deepfakes e inteligencia artificial'), img: 'img/phone.jpg' },
      { k: 'join' },
      { k: 'text', h: T('Test na start', 'Starting test', 'Test inicial'), li: [T('3 krótkie pytania, sprawdzamy, co już wiemy', '3 short questions to check what we already know', '3 preguntas cortas para ver lo que ya sabemos'), T('Na koniec te same pytania i porównamy wyniki', 'At the end, the same questions and we compare', 'Al final, las mismas preguntas y comparamos')] },
      { k: 'q', q: 'dz1', phase: 'pre' }, { k: 'q', q: 'dz2', phase: 'pre' }, { k: 'q', q: 'dz3', phase: 'pre' },
      { k: 'text', h: T('Czym jest dezinformacja?', 'What is disinformation?', '¿Qué es la desinformación?'), li: [
        T('Fałszywa informacja szerzona celowo: dla pieniędzy, polityki albo kliknięć', 'False information spread on purpose: for money, politics or clicks', 'Información falsa difundida a propósito: por dinero, política o clics'),
        T('Działa, bo budzi emocje: strach, złość, oburzenie', 'It works because it triggers emotions: fear, anger, outrage', 'Funciona porque despierta emociones: miedo, rabia, indignación'),
        T('Najszybciej rozchodzi się przez znajomych i rodzinę', 'It spreads fastest through friends and family', 'Se difunde más rápido a través de amigos y familia')
      ] },
      { k: 'post', text: T('PILNE!!! Od jutra UE ZAKAZUJE kiszenia ogórków w domu! Udostępnij, zanim to usuną!!!', 'URGENT!!! From tomorrow the EU BANS home-made pickles! Share before they delete this!!!', '¡¡¡URGENTE!!! ¡Desde mañana la UE PROHÍBE hacer conservas en casa! ¡¡Comparte antes de que lo borren!!'), note: T('Przykład wymyślony na potrzeby zajęć', 'A made-up example for this class', 'Ejemplo inventado para la clase') },
      { k: 'q', q: 'dz_signal' },
      { k: 'text', h: T('STOP: 4 kroki przed udostępnieniem', 'STOP: 4 steps before you share', 'STOP: 4 pasos antes de compartir'), li: [
        T('S – Spokój: emocje to sygnał ostrzegawczy', 'S – Slow down: strong emotions are a warning sign', 'S – Serenidad: las emociones fuertes son una alerta'),
        T('T – Kto to napisał? Jest autor, data, źródło?', 'T – Who wrote it? Is there an author, a date, a source?', 'T – ¿Quién lo escribió? ¿Hay autor, fecha, fuente?'),
        T('O – Inne źródła: czy podają to radio, TV, gazety?', 'O – Other sources: do radio, TV or papers report it?', 'O – Otras fuentes: ¿lo dicen la radio, la tele, la prensa?'),
        T('P – Pokaż zdjęcie Google Lens: skąd naprawdę pochodzi?', 'P – Put the photo into Google Lens: where is it really from?', 'P – Pasa la foto por Google Lens: ¿de dónde viene?')
      ] },
      { k: 'task', h: T('Detektyw zdjęć', 'Photo detective', 'Detective de fotos'), img: 'img/valor.jpg', li: [
        T('Zróbcie tabletem zdjęcie tego obrazka na ekranie', 'Take a photo of this picture on the screen with the tablet', 'Haced una foto de esta imagen con la tableta'),
        T('Google Lens lub aplikacja Google → ikona aparatu', 'Google Lens or the Google app → camera icon', 'Google Lens o la app de Google → icono de cámara'),
        T('Gdzie i co to jest? Podajcie miasto i nazwę', 'Where and what is it? Name the town and the place', '¿Qué es y dónde está? Decid ciudad y nombre'),
        T('Dobra odpowiedź = 3 punkty', 'Correct answer = 3 points', 'Respuesta correcta = 3 puntos')
      ] },
      { k: 'text', h: T('Deepfake: „Babciu, to ja!”', 'Deepfake: “Grandma, it’s me!”', 'Deepfake: «¡Abuela, soy yo!»'), img: 'img/phone.jpg', li: [
        T('AI potrafi podrobić twarz i głos bliskiej osoby', 'AI can fake the face and voice of someone you love', 'La IA puede imitar la cara y la voz de un ser querido'),
        T('Oszuści biorą nagrania z Facebooka czy TikToka', 'Scammers take recordings from Facebook or TikTok', 'Los estafadores usan grabaciones de Facebook o TikTok'),
        T('Fałszywe reklamy „inwestycji” ze znanymi osobami', 'Fake “investment” ads with famous people', 'Anuncios falsos de «inversión» con famosos')
      ] },
      { k: 'q', q: 'dz_voice' },
      { k: 'task', h: T('Złap AI na błędzie', 'Catch the AI out', 'Pilla a la IA'), li: [
        T('Otwórzcie na tablecie Copilota lub ChatGPT', 'Open Copilot or ChatGPT on the tablet', 'Abrid Copilot o ChatGPT en la tableta'),
        T('Napiszcie: „kaszubska babcia w hafcie na plaży w Alicante”', 'Type: “Kashubian grandma in embroidery on the beach in Alicante”', 'Escribid: «abuela casubia con bordado en la playa de Alicante»'),
        T('Szukajcie błędów: dłonie, napisy, cienie, tło', 'Look for mistakes: hands, writing, shadows, background', 'Buscad fallos: manos, letras, sombras, fondo'),
        T('Każdy znaleziony błąd = 1 punkt', 'Each mistake found = 1 point', 'Cada fallo encontrado = 1 punto')
      ] },
      { k: 'q', q: 'dz_share' },
      { k: 'text', h: T('Test na koniec', 'Final test', 'Test final'), li: [T('Te same 3 pytania – zobaczmy, ile się nauczyliśmy', 'The same 3 questions – let’s see what we learned', 'Las mismas 3 preguntas: veamos cuánto aprendimos')] },
      { k: 'q', q: 'dz1', phase: 'post' }, { k: 'q', q: 'dz2', phase: 'post' }, { k: 'q', q: 'dz3', phase: 'post' },
      { k: 'prepost', qs: ['dz1', 'dz2', 'dz3'] },
      { k: 'score' },
      { k: 'end', h: T('Myśl, zanim udostępnisz!', 'Think before you share!', '¡Piensa antes de compartir!') }
    ]
  },
  {
    id: 'p5', title: T('Bezpieczeństwo w sieci', 'Staying safe online', 'Seguridad en internet'),
    slides: [
      { k: 'title', kicker: T('Prezentacja 5', 'Presentation 5', 'Presentación 5'), h: T('Bezpieczni w sieci', 'Safe online', 'Seguros en internet'), p: T('Oszustwa, hasła i jak się bronić', 'Scams, passwords and how to protect yourself', 'Estafas, contraseñas y cómo protegerse'), img: 'img/laptop.jpg' },
      { k: 'join' },
      { k: 'text', h: T('Test na start', 'Starting test', 'Test inicial'), li: [T('3 pytania – na koniec powtórzymy', '3 questions – we repeat them at the end', '3 preguntas que repetiremos al final')] },
      { k: 'q', q: 'bz1', phase: 'pre' }, { k: 'q', q: 'bz2', phase: 'pre' }, { k: 'q', q: 'bz3', phase: 'pre' },
      { k: 'text', h: T('Najczęstsze oszustwa', 'The most common scams', 'Las estafas más comunes'), li: [
        T('SMS „dopłata do paczki”, „niezapłacony rachunek”', 'Texts about a “parcel fee” or an “unpaid bill”', 'SMS de «pago de paquete» o «factura impagada»'),
        T('Telefon „na wnuczka”, „na policjanta”, „z banku”', 'Calls “from your grandchild”, “the police”, “the bank”', 'Llamadas «del nieto», «de la policía», «del banco»'),
        T('„Mamo, to mój nowy numer” na WhatsAppie', '“Mum, this is my new number” on WhatsApp', '«Mamá, este es mi nuevo número» por WhatsApp'),
        T('Reklamy „pewnych inwestycji” z deepfake celebrytów', '“Sure investment” ads with deepfaked celebrities', 'Anuncios de «inversión segura» con famosos falsos')
      ] },
      { k: 'q', q: 'bz_sms1' },
      { k: 'q', q: 'bz_sms2' },
      { k: 'text', h: T('5 zasad do zapamiętania', '5 rules to remember', '5 reglas para recordar'), li: [
        T('Nie klikam w linki z SMS-ów i maili', "I don't click links in texts and emails", 'No pincho enlaces de SMS ni correos'),
        T('Sam dzwonię na znany numer: banku, dziecka, urzędu', 'I call a number I know myself: the bank, my child, the office', 'Llamo yo a un número conocido: banco, hijo, oficina'),
        T('Hasło = długie zdanie, a do tego kod z SMS-a (2FA)', 'Password = a long sentence, plus an SMS code (2FA)', 'Contraseña = frase larga, más código por SMS (2FA)'),
        T('Nikomu nie podaję kodów BLIK ani kodów z SMS', 'I never give anyone payment or SMS codes', 'Nunca doy códigos de pago ni de SMS'),
        T('Mamy rodzinne słowo-hasło na „pilne” telefony', 'Our family has a code word for “urgent” calls', 'En familia tenemos una palabra clave para llamadas «urgentes»')
      ] },
      { k: 'task', h: T('Zabezpieczcie tablet', 'Secure the tablet', 'Proteged la tableta'), li: [
        T('Ustawienia → Face ID / kod: czy blokada jest włączona?', 'Settings → Face ID / passcode: is the lock on?', 'Ajustes → Face ID / código: ¿está activado el bloqueo?'),
        T('Ustawienia → Prywatność → Lokalizacja: które aplikacje widzą, gdzie jesteś?', 'Settings → Privacy → Location: which apps know where you are?', 'Ajustes → Privacidad → Localización: ¿qué apps saben dónde estás?'),
        T('Sprawdźcie, czy system ma aktualizację', 'Check whether there is a system update', 'Comprobad si hay actualización del sistema'),
        T('Każde znalezisko = 1 punkt', 'Each finding = 1 point', 'Cada hallazgo = 1 punto')
      ] },
      { k: 'q', q: 'bz_word' },
      { k: 'text', h: T('Test na koniec', 'Final test', 'Test final'), li: [T('Te same 3 pytania', 'The same 3 questions', 'Las mismas 3 preguntas')] },
      { k: 'q', q: 'bz1', phase: 'post' }, { k: 'q', q: 'bz2', phase: 'post' }, { k: 'q', q: 'bz3', phase: 'post' },
      { k: 'prepost', qs: ['bz1', 'bz2', 'bz3'] },
      { k: 'score' },
      { k: 'cert' },
      { k: 'credits' },
      { k: 'end', h: T('Dziękujemy! Dzãkùjemë! ¡Gracias!', 'Thank you! Dzãkùjemë! ¡Gracias!', '¡Gracias! Dzãkùjemë! Dziękujemy!') }
    ]
  }
];
