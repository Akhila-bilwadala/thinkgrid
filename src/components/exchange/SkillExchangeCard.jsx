import React from 'react';
import { ArrowLeftRight, Clock, MapPin, Star, Laptop, MessageSquare } from 'lucide-react';
import './SkillExchangeCard.css';

const SkillExchangeCard = ({ request }) => {
    return (
        <div className="exchange-card-v2 premium-card animate-fade">
            <div className="exchange-header">
                <div className="request-type">
                    <ArrowLeftRight size={16} />
                    <span>Skill Swap Proposal</span>
                </div>
                <div className="partner-rating">
                    <Star size={14} className="star-icon" />
                    <span>{request.sender.rating}</span>
                </div>
            </div>

            <div className="exchange-main">
                <div className="swap-visual">
                    <div className="skill-box offer">
                        <span className="box-label">Offers</span>
                        <span className="skill-name">{request.skillOffered}</span>
                    </div>
                    <div className="swap-arrow">
                        <ArrowLeftRight size={20} />
                    </div>
                    <div className="skill-box demand">
                        <span className="box-label">Wants</span>
                        <span className="skill-name">{request.skillWanted}</span>
                    </div>
                </div>

                <div className="partner-summary">
                    <div className="partner-avatar-v2">
                        {request.sender.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="partner-details">
                        <span className="partner-name">{request.sender.name}</span>
                        <span className="partner-meta">{request.sender.institution} • {request.sender.year}</span>
                    </div>
                </div>

                <div className="proposal-meta">
                    <div className="meta-item">
                        <Clock size={14} />
                        <span>{request.schedule}</span>
                    </div>
                    <div className="meta-item">
                        <Laptop size={14} />
                        <span>{request.mode}</span>
                    </div>
                </div>

                <p className="proposal-message">"I can help you master {request.skillOffered} in 4 sessions if you can guide me through {request.skillWanted}."</p>
            </div>

            <div className="exchange-footer">
                <button className="reject-btn">Decline</button>
                <button className="accept-btn">Accept Swap</button>
            </div>
        </div>
    );
};

export default SkillExchangeCard;
