import React from 'react'
import "./index.scss"
import { FaPlane } from "react-icons/fa";
import { TbActivityHeartbeat } from "react-icons/tb";
import { FaHeart } from "react-icons/fa6";
import { FaHouse } from "react-icons/fa6";
import { FaCar } from "react-icons/fa";
import { FaShield } from "react-icons/fa6";



const UmSig = () => {
  return (
    <>
      <section className='umSigorta'>
        <div className='container'>
          <div className='all row'>
            <div className='box1 col-9'>
              <div className='kampaniya'>
                <h3>Yeni il kampaniyası</h3>
                <p>Səyahət sığortasında 30% endirim. Yeni il tətillərinizi güvənli keçirin</p>
              </div>
              <div className='act'  >
                <a href='#' className='aD'>Kateqoriyalar</a>
                <a href='#'>Hamsini gor</a>
              </div>
              <div className='sig row '>
                <div className='sey col-4 sam'>
                  <div className='svg'>
                    <FaPlane />

                  </div>
                  <div className='par'>
                    <h4>Səyahət</h4>
                    <p>Beynəlxalq və daxili səyahət sığortası</p>
                  </div>
                </div>
                <div className='heyat col-4 sam'>
                  <div className='svg'>
                    <TbActivityHeartbeat />
                  </div>
                  <div className='par'>
                    <h4>Həyat</h4>
                    <p>Həyat və təqaüd sığortası</p>
                  </div>
                </div>
                <div className='tibbi col-4 sam'>
                  <div className='svg'>
                    <FaHeart />
                  </div>

                  <div className='par'>
                    <h4>Tibbi</h4>
                    <p>Tibbi xəərclərin ödənilməsi</p>
                  </div>
                </div>
                <div className='emlak col-4 sam'>
                  <div className='svg'>
                    <FaHouse />
                  </div>

                  <div className='par'>
                    <h4>Əmlak</h4>
                    <p>Ev və digər əmlak sığortası</p>
                  </div>
                </div>
                <div className='neqliy col-4 sam'>
                  <div className='svg'>
                    <FaCar />
                  </div>

                  <div className='par'>
                    <h4>Nəqliyyat</h4>
                    <p>Avtomobil və nəqliyyat sığortası</p>
                  </div>
                </div>
              </div>
            </div>
            <div className='box2 col-3'>

            </div>
          </div>
        </div>
      </section>
      <section className='tamam'>
        <div className='container'>

          <div className='all '>
            <div className='ms col-9'>
              <div className='act row'>
                <a href='#' className='wh'>Tamamlanmis sigortalar</a>
                <a href='#'>hamisini gor</a>
              </div>
              <div className='cards row '>
                <div className='card'>
                  <div className='ip'>
                    <div className='svg'>
                      <FaShield />
                    </div>
                    <div className='par2'>
                      <h4>Mega sigorta</h4>
                      <p> seyahet sigorta</p>
                      <span>15 oktyabir</span>
                    </div>
                  </div>
                  <div>
                    <p>980 AZN</p>

                  </div>
                </div>
                <div className='card'>
                  <div className='ip'>
                    <div className='svg'>
                      <FaShield />
                    </div>

                    <div className='par2'>
                      <h4>Mega sigorta</h4>
                      <p> seyahet sigorta</p>
                      <span>15 oktyabir</span>
                    </div>
                  </div>
                  <div>
                    <p>980 AZN</p>

                  </div>
                </div>
                <div className='card'>
                  <div className='ip'>
                    <div className='svg'>
                      <FaShield />
                    </div>

                    <div className='par2'>
                      <h4>Mega sigorta</h4>
                      <p> seyahet sigorta</p>
                      <span>15 oktyabir</span>
                    </div>
                  </div>
                  <div>
                    <p>980 AZN</p>

                  </div>
                </div>
              </div>
            </div>
            <div className='statistika col-3'>
              <h4>Statistika</h4>
              <div className='stat'>
                <div className='actS same'>
                  <p>aktiv sigortalar</p>
                  <span>12</span>

                </div>
                <div className='xerc same'>
                  <p>bu ay xercler</p>
                  <span>12</span>
                </div>
                <div className='oden same'>
                  <p>yaxin odenisler</p>
                  <span>12</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  )
}

export default UmSig