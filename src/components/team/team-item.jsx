import React from "react";
import Image from "next/image";
import Link from "next/link";
export default function TeamItem({ item, handleTeamModal }) {
    return (<div className="tp-team-item tp-hover-btn-wrapper marque fix mb-30">
      <div className="tp-hover-btn-item">
        <Image style={{ width: "auto", height: "auto" }} src={item.image} alt="team-img" width={375} height={464}/>
      </div>
      <div className="tp-team-content">
        <span>{item.designation}</span>
        <h4 className="tp-team-title-sm" onClick={() => handleTeamModal(item)}>
          <Link href={`/team-details/${item.id}`}>{item.name}</Link>
        </h4>
      </div>
    </div>);
}
