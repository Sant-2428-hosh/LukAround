const urls = [
  'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/79/Triveni_Sangam_at_Allahabad.jpg/1280px-Triveni_Sangam_at_Allahabad.jpg',
  'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fb/Tomb_of_Prince_Khusrau%2C_Allahabad%2C_Uttar_Pradesh.jpg/1280px-Tomb_of_Prince_Khusrau%2C_Allahabad%2C_Uttar_Pradesh.jpg',
  'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/41/Marina_Beach_in_Chennai.jpg/1280px-Marina_Beach_in_Chennai.jpg',
  'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fb/Mahabalipuram_Sea_Shore.jpg/1280px-Mahabalipuram_Sea_Shore.jpg',
  'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/07/Thirumalai_Nayakkar_Mahal.jpg/1280px-Thirumalai_Nayakkar_Mahal.jpg',
  'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/91/Bryant_Park%2C_Kodaikanal_1.jpg/1280px-Bryant_Park%2C_Kodaikanal_1.jpg',
  'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f8/Pine_forest%2C_Kodaikanal.jpg/1280px-Pine_forest%2C_Kodaikanal.jpg',
  'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/50/Rameswaram_Beach.jpg/1280px-Rameswaram_Beach.jpg',
  'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/76/Hampi_-_Vittala_Temple_-_Kalyana_Mandapa_Columns.jpg/1280px-Hampi_-_Vittala_Temple_-_Kalyana_Mandapa_Columns.jpg',
  'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8c/Kudle_beach_gokarna.jpg/1280px-Kudle_beach_gokarna.jpg',
  'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f9/Administrative_Building_-_Indian_Museum_-_Kolkata_2012-12-21_2443.JPG/1280px-Administrative_Building_-_Indian_Museum_-_Kolkata_2012-12-21_2443.JPG',
  'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/08/Darjeeling_Himalayan_Railway%2Ctoy_train_%281%29.jpg/1280px-Darjeeling_Himalayan_Railway%2Ctoy_train_%281%29.jpg',
  'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/26/Somnath_Temple_Gujarat.jpg/1280px-Somnath_Temple_Gujarat.jpg',
  'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ec/Rann_of_Kutch_-_White_Desert_2.jpg/1280px-Rann_of_Kutch_-_White_Desert_2.jpg',
  'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/73/UNESCO_RAMAPPA_TEMPLE.jpg/1280px-UNESCO_RAMAPPA_TEMPLE.jpg',
  'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/87/Chinese_fishingnet_kochi.jpg/1280px-Chinese_fishingnet_kochi.jpg',
  'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c5/Chhatrapati_Shivaji_Terminus_%28Victoria_Terminus%29.jpg/1280px-Chhatrapati_Shivaji_Terminus_%28Victoria_Terminus%29.jpg',
  'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5e/Umaid_Bhawan%2C_Jodhpur.jpg/1280px-Umaid_Bhawan%2C_Jodhpur.jpg',
  'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2e/Kanyakumari_magical_sunset.jpg/1280px-Kanyakumari_magical_sunset.jpg',
  'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e6/Taj_Ul_Masajid%2C_Bhopal.JPG/1280px-Taj_Ul_Masajid%2C_Bhopal.JPG',
  'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/52/Rajwada_Palace%2C_Indore.jpg/1280px-Rajwada_Palace%2C_Indore.jpg',
  'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/be/Prem_mandir_Vrindavan_Main_gate.JPG/1280px-Prem_mandir_Vrindavan_Main_gate.JPG',
  'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b5/Panchghani_-_Mahabaleshwar_%285769697913%29.jpg/1280px-Panchghani_-_Mahabaleshwar_%285769697913%29.jpg',
  'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/78/Dinantika_-_Ashram_Complex_-_Santiniketan_02.jpg/1280px-Dinantika_-_Ashram_Complex_-_Santiniketan_02.jpg',
  'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/ca/Banasura_Sagar_Dam_Wayanad4.jpg/1280px-Banasura_Sagar_Dam_Wayanad4.jpg',
  'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8d/Golghar%2C_Patna%2C_Bihar.jpg/1280px-Golghar%2C_Patna%2C_Bihar.jpg',
  'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bb/Lingaraja_Temple_01.jpg/1280px-Lingaraja_Temple_01.jpg',
  'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/29/Chilika_Lake_Mangalajodi_Wetlands_Odisha_India_2012.jpg/1280px-Chilika_Lake_Mangalajodi_Wetlands_Odisha_India_2012.jpg',
  'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d0/Khalsa_Heritage_Memorial_176_Edit.jpg/1280px-Khalsa_Heritage_Memorial_176_Edit.jpg',
  'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/df/Qila_Mubarak%2C_Patiala.jpg/1280px-Qila_Mubarak%2C_Patiala.jpg',
  'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4e/Forest_Research_Institute_campus%2C_Dehradun%2C_India.jpg/1280px-Forest_Research_Institute_campus%2C_Dehradun%2C_India.jpg',
  'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/30/Mussoorie_town%2C_a_hill_station_in_Dehradun_district_01.jpg/1280px-Mussoorie_town%2C_a_hill_station_in_Dehradun_district_01.jpg',
  'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/32/Yercaud_hills.jpg/1280px-Yercaud_hills.jpg'
];

async function testAll() {
  let ok = 0, fail = 0;
  for (const u of urls) {
    try {
      const res = await fetch(u, { headers: { 'User-Agent': 'LukAroundValidator/1.0' } });
      if (res.status === 200) {
        ok++;
      } else {
        console.log('FAIL ' + res.status + ': ' + u);
        fail++;
      }
    } catch(e) {
      console.log('ERR: ' + e.message + ' ' + u);
      fail++;
    }
  }
  console.log('Finished validation: ' + ok + ' OK, ' + fail + ' failed.');
}
testAll();
