import React, { useState, useEffect } from 'react';
import "./index.scss";
import { TbActivityHeartbeat, TbStarFilled, TbCheck, TbInfoCircle } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom'; // <-- əlavə et
import InsuranceCategory from '../../comoponents/insuranceUi';

const SeyahatSigortasi = () => {

  return (
    <InsuranceCategory
      type="passenger_accident"
      title="Səyahət Sığortası"
      subtitle="Beynəlxalq və daxili səyahət sığortası"
    />
  );
};

export default SeyahatSigortasi;
