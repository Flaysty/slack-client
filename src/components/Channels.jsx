import React from 'react';
import styled from 'styled-components';
import { Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const ChannelWrapper = styled.div`
  grid-column: 2;
  grid-row: 1/4;
  background-color: #4e3a4c;
  color: #958993;
  padding: 10px 0px 10px 0px;
`;
const paddingLeft = 'padding-left: 10px';
const PushLeft = styled.div`${paddingLeft}`;
const TeamNameHeader = styled.h1`
  color: #fff;
  font-size: 20px;
`;
const SideBarList = styled.ul`
  width: 100%;
  list-style: none;
  padding-left: 0px;
`;
const SideBarListHeader = styled.li`${paddingLeft}`;
const SideBarListItem = styled.li`
  padding: 2px;
  ${paddingLeft};
  &:hover {
    background: #3e313c;
  }
`;
const Green = styled.span`color: #38978d`;
const Bubble = ({ on = true }) => (on ? <Green>● </Green> : '○ ');

const channel = ({ id, name }, teamId) => (
  <Link key={`channel-${id}`} to={`/view-team/${teamId}/${id}`}>
    <SideBarListItem>
      {`# ${name}`}
    </SideBarListItem>
  </Link>
);
const user = ({ id, username }, teamId) => (
  <Link key={`user-${id}`} to={`/view-team/user/${teamId}/${id}`}>
    <SideBarListItem>
      <Bubble />
      {username}
    </SideBarListItem>
  </Link>
);

export default ({
  teamName,
  username,
  channels, users,
  onAddChannelClick,
  teamId,
  onInvitePeopleClick,
  onDirectMessageClick,
  isOwner,
}) => (
  <ChannelWrapper>
    <PushLeft>
      <TeamNameHeader>
        {teamName}
      </TeamNameHeader>
      {username}
    </PushLeft>
    <div>
      <SideBarList>
        <SideBarListHeader>
          Каналы
          {isOwner && (<Icon onClick={onAddChannelClick} name="add circle" />)}
        </SideBarListHeader>
        {channels.map(c => channel(c, teamId))}
      </SideBarList>
    </div>
    <div>
      <SideBarList>
        <SideBarListHeader>
          Личные сообщения
          <Icon onClick={onDirectMessageClick} name="add circle" />
        </SideBarListHeader>
        {users.map(u => user(u, teamId))}
      </SideBarList>
    </div>
    {isOwner
      && (
        <div>
          <a href="#invite-people" onClick={onInvitePeopleClick}>
            + пригласить
          </a>
        </div>
      )
  }
  </ChannelWrapper>
);