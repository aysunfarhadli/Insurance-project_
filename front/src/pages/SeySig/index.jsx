import React from 'react'
import "./index.scss"
import { TbActivityHeartbeat } from 'react-icons/tb'

const SeySigorta = () => {
  return (
    <section className='seysig'>
      <div className='container'>
        <div className='all'>
          <div className='head'>
            <div className='is row'>
              <div className='svg '>
                <TbActivityHeartbeat />
              </div>
              <div className='par'>
                <h4>Səyahət Sığortası</h4>
                <p>Beynəlxalq və daxili səyahət sığortası</p>
              </div>
            </div>
            <div>
              <span>Filtr</span>
            </div>
          </div>
          <div className='head2'>
            <button>Hamısı</button>
            <button>Populyar</button>

            <button>Ən ucuz</button>

            <button>ən Sürətli</button>

            <button>Premium</button>

          </div>
          <div className='cards row '>
            <div className='card col-6'>
              <div className='Chead'>
                <div className='is'>
                  <div className='svg'>
                    <TbActivityHeartbeat />
                  </div>
                  <div className='par'>
                    <h4>Səyahət Sığortası</h4>
                    <p>Beynəlxalq və daxili səyahət sığortası</p>
                  </div>
                </div>
              </div>
              <div className='Cbody'>
                <div className='detal'>
                  <div className='inf'>
                    <h5>Günlük</h5>
                    <p>3-15 AZN</p>
                  </div>
                  <div className='inf'>
                    <h5>Rəsmlaşdirmə</h5>
                    <p>2-3 Saat</p>
                  </div>
                  <div className='inf'>
                    <h5>Əhatə məbləği</h5>
                    <p>30k-150k EUR</p>
                  </div>
                  <div className='inf'>
                    <h5>Regionlar</h5>
                    <p>Avropaç Asiya...</p>
                  </div>
                  <div className='inf'>
                    <h5>Ölkələr</h5>
                    <p>180</p>
                  </div>

                </div>

              </div>
              <div className='Cbody2'>
                <h5>Xüsusiyyətlər</h5>
                <div className='xus'>
                    <p>Beynəlxalq əhatə</p>
                    <p>COVID-19 əhatəsi</p>
                    <p>Sürətli ödəniş</p>
                    <p>24/7 Dəstək</p>
                </div>
              </div>
              <div className='Cbody3'>
                <div>
                  <span>Tibbi təcil</span>
                </div>
                <div>
                  <span>Səyahət ləğvi</span>
                </div>
                <div>
                  <span>Baqaj itkisi</span>
                </div>
                <div>
                  <span>Uçuş gecikmə</span>
                </div>
              </div>
              <div className='but'>
                <button>Ətraflı</button>
                <button>Müraciət et</button>
              </div>
            </div>
            <div className='card col-6'>
              <div className='Chead'>
                <div className='is'>
                  <div className='svg'>
                    <TbActivityHeartbeat />
                  </div>
                  <div className='par'>
                    <h4>Səyahət Sığortası</h4>
                    <p>Beynəlxalq və daxili səyahət sığortası</p>
                  </div>
                </div>
              </div>
              <div className='Cbody'>
                <div className='detal'>
                  <div className='inf'>
                    <h5>Günlük</h5>
                    <p>3-15 AZN</p>
                  </div>
                  <div className='inf'>
                    <h5>Rəsmlaşdirmə</h5>
                    <p>2-3 Saat</p>
                  </div>
                  <div className='inf'>
                    <h5>Əhatə məbləği</h5>
                    <p>30k-150k EUR</p>
                  </div>
                  <div className='inf'>
                    <h5>Regionlar</h5>
                    <p>Avropaç Asiya...</p>
                  </div>
                  <div className='inf'>
                    <h5>Ölkələr</h5>
                    <p>180</p>
                  </div>

                </div>

              </div>
              <div className='Cbody2'>
                <h5>Xüsusiyyətlər</h5>
                <div className='xus'>
                    <p>Beynəlxalq əhatə</p>
                    <p>COVID-19 əhatəsi</p>
                    <p>Sürətli ödəniş</p>
                    <p>24/7 Dəstək</p>
                </div>
              </div>
              <div className='Cbody3'>
                <div>
                  <span>Tibbi təcil</span>
                </div>
                <div>
                  <span>Səyahət ləğvi</span>
                </div>
                <div>
                  <span>Baqaj itkisi</span>
                </div>
                <div>
                  <span>Uçuş gecikmə</span>
                </div>
              </div>
              <div className='but'>
                <button>Ətraflı</button>
                <button>Müraciət et</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SeySigorta