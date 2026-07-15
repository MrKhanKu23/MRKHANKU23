import type { Player } from './sportsData';

type DraftRow = [string, string, string, string, number];
const nation = (country: string, rows: DraftRow[]): Player[] => rows.map(([name, role, stat, years, rating]) => ({
  name, detail: `${role} · ${country}`, stat, badge: name.split(' ').map((part) => part[0]).join('').slice(0, 3), team: country, years, rating,
  status: years.includes('present') ? 'active' : 'retired', honours: [stat],
}));

export const footballDraftPlayers: Player[] = [
  ...nation('Spain', [
    ['Iker Casillas','Goalkeeper','World Cup, 2 Euros, 3 Champions Leagues','1999–2020',97],['Sergio Ramos','Defender','World Cup, 2 Euros, 4 Champions Leagues','2004–present',97],
    ['Sergio Busquets','Midfielder','World Cup, Euro, 3 Champions Leagues','2008–2025',95],['David Villa','Forward','World Cup, Euro, Champions League','2000–2020',93],
    ['Fernando Torres','Forward','World Cup, 2 Euros, Champions League','2001–2019',92],['Raúl González','Forward','3 Champions Leagues','1994–2015',93],
    ['Carles Puyol','Defender','World Cup, Euro, 3 Champions Leagues','1999–2014',95],['Xabi Alonso','Midfielder','World Cup, 2 Euros, 2 Champions Leagues','1999–2017',94],
  ]),
  ...nation('Italy', [
    ['Gianluigi Buffon','Goalkeeper','World Cup and 10 Serie A titles','1995–2023',97],['Franco Baresi','Defender','World Cup and 3 European Cups','1977–1997',98],
    ['Fabio Cannavaro','Defender','World Cup and Ballon d’Or','1992–2011',95],['Andrea Pirlo','Midfielder','World Cup and 2 Champions Leagues','1995–2017',96],
    ['Francesco Totti','Forward','World Cup and Serie A title','1992–2017',94],['Alessandro Del Piero','Forward','World Cup and Champions League','1991–2014',94],
    ['Alessandro Nesta','Defender','World Cup and 2 Champions Leagues','1993–2014',95],['Paolo Rossi','Forward','World Cup and Ballon d’Or','1973–1987',94],
  ]),
  ...nation('France', [
    ['Thierry Henry','Forward','World Cup, Euro and Champions League','1994–2014',97],['Kylian Mbappé','Forward','World Cup and multiple league titles','2015–present',96],
    ['Karim Benzema','Forward','Ballon d’Or and 5 Champions Leagues','2004–present',97],['Patrick Vieira','Midfielder','World Cup and Euro','1994–2011',93],
    ['Didier Deschamps','Midfielder','World Cup and 2 Champions Leagues','1985–2001',92],['N’Golo Kanté','Midfielder','World Cup and Champions League','2011–present',94],
    ['Lilian Thuram','Defender','World Cup and Euro','1991–2008',93],['Antoine Griezmann','Forward','World Cup and Europa League','2009–present',93],
  ]),
  ...nation('Argentina', [
    ['Gabriel Batistuta','Forward','2 Copa América titles','1988–2005',94],['Ángel Di María','Winger','World Cup, Copa América, Champions League','2005–present',94],
    ['Sergio Agüero','Forward','Copa América and 5 Premier League titles','2003–2021',94],['Javier Mascherano','Midfielder','2 Champions Leagues','2003–2018',92],
    ['Daniel Passarella','Defender','2 World Cup titles','1971–1989',95],['Mario Kempes','Forward','World Cup Golden Boot','1970–1996',95],
    ['Juan Román Riquelme','Midfielder','3 Copa Libertadores titles','1996–2014',93],['Javier Zanetti','Defender','Champions League and 5 Serie A titles','1992–2014',95],
  ]),
  ...nation('Portugal', [
    ['Eusébio','Forward','Ballon d’Or and European Cup','1957–1979',98],['Luís Figo','Winger','Ballon d’Or and Champions League','1989–2009',96],
    ['Deco','Midfielder','2 Champions Leagues','1995–2013',92],['Pepe','Defender','Euro and 3 Champions Leagues','2001–2024',93],
    ['Rui Costa','Midfielder','Champions League and Serie A title','1990–2008',92],['Bernardo Silva','Midfielder','Champions League and multiple league titles','2013–present',92],
    ['Bruno Fernandes','Midfielder','Domestic cups and Nations League','2012–present',90],['Ricardo Carvalho','Defender','Champions League and 3 Premier League titles','1997–2018',92],
  ]),
  ...nation('Germany', [
    ['Lothar Matthäus','Midfielder','World Cup and Ballon d’Or','1979–2000',98],['Miroslav Klose','Forward','World Cup and World Cup scoring record','1998–2016',95],
    ['Manuel Neuer','Goalkeeper','World Cup and 2 Champions Leagues','2004–present',97],['Philipp Lahm','Defender','World Cup and Champions League','2002–2017',96],
    ['Toni Kroos','Midfielder','World Cup and 6 Champions Leagues','2007–2024',97],['Thomas Müller','Forward','World Cup and 2 Champions Leagues','2008–present',95],
    ['Karl-Heinz Rummenigge','Forward','2 Ballon d’Or awards and 2 European Cups','1974–1989',96],['Matthias Sammer','Defender','Ballon d’Or and Euro','1985–1998',93],
  ]),
  ...nation('Netherlands', [
    ['Marco van Basten','Forward','3 Ballon d’Or awards and 2 European Cups','1981–1995',98],['Ruud Gullit','Midfielder','Ballon d’Or and 2 European Cups','1979–1998',96],
    ['Frank Rijkaard','Midfielder','3 European Cups and Euro','1980–1995',96],['Dennis Bergkamp','Forward','3 Premier League titles','1986–2006',94],
    ['Arjen Robben','Winger','Champions League and 8 Bundesliga titles','2000–2021',95],['Wesley Sneijder','Midfielder','Champions League treble','2002–2019',93],
    ['Robin van Persie','Forward','Premier League and UEFA Cup','2001–2019',92],['Ronald Koeman','Defender','Euro and 2 European Cups','1980–1997',95],
  ]),
  ...nation('Brazil', [
    ['Cafu','Defender','2 World Cups and 2 Copa Libertadores','1989–2008',97],['Roberto Carlos','Defender','World Cup and 3 Champions Leagues','1991–2015',96],
    ['Romário','Forward','World Cup and FIFA World Player','1985–2009',97],['Rivaldo','Forward','World Cup and Ballon d’Or','1991–2015',96],
    ['Kaká','Midfielder','World Cup, Ballon d’Or, Champions League','2001–2017',95],['Neymar','Forward','Champions League and Copa Libertadores','2009–present',95],
    ['Sócrates','Midfielder','Brazilian championship icon','1973–1989',93],['Zico','Midfielder','Copa Libertadores and Intercontinental Cup','1971–1994',96],
  ]),
  ...nation('Morocco', [
    ['Achraf Hakimi','Defender','Champions League and league titles','2016–present',91],['Yassine Bounou','Goalkeeper','Europa League and continental titles','2010–present',90],
    ['Hakim Ziyech','Winger','Champions League and Eredivisie title','2012–present',90],['Sofyan Amrabat','Midfielder','Domestic cup winner','2014–present',87],
    ['Noureddine Naybet','Defender','La Liga champion','1989–2006',89],['Mustapha Hadji','Midfielder','African Player of the Year','1991–2010',89],
    ['Youssef En-Nesyri','Forward','Europa League champion','2016–present',87],['Sofiane Boufal','Winger','World Cup semifinalist','2012–present',85],
  ]),
  ...nation('England', [
    ['Bobby Charlton','Midfielder','World Cup, Ballon d’Or, European Cup','1956–1976',98],['Bobby Moore','Defender','World Cup-winning captain','1958–1978',97],
    ['Wayne Rooney','Forward','Champions League and 5 Premier League titles','2002–2018',95],['David Beckham','Midfielder','Champions League and 6 Premier League titles','1992–2013',94],
    ['Steven Gerrard','Midfielder','Champions League and domestic cups','1998–2016',94],['Frank Lampard','Midfielder','Champions League and 3 Premier League titles','1995–2017',94],
    ['Paul Scholes','Midfielder','2 Champions Leagues and 11 league titles','1993–2013',95],['Alan Shearer','Forward','Premier League title and scoring record','1988–2006',94],
  ]),
];
