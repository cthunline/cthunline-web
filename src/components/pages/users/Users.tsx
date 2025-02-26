import { Button, Chip, Switch, Table } from '@mantine/core';
import { modals } from '@mantine/modals';
import { FaRegHandshake } from 'react-icons/fa';
import { HiPlus } from 'react-icons/hi';
import { MdCheck } from 'react-icons/md';

import useUser from '../../../hooks/api/useUser.js';
import { useAuthStore } from '../../../stores/auth.js';
import { useConfigurationStore } from '../../../stores/configuration.js';
import { useLocaleStore } from '../../../stores/locale.js';
import ContentBox from '../../common/ContentBox.js';
import UserForm, { type UserSubmitData } from '../../features/user/UserForm.js';
import Invitation from './Invitation.js';

const createUserModalId = 'create-user-modal';

const Users = () => {
    const T = useLocaleStore(({ T }) => T);
    const user = useAuthStore(({ user }) => user);
    const configuration = useConfigurationStore(
        (configuration) => configuration
    );

    const { userList, editUser, createUser } = useUser({
        loadList: true,
        listDisabled: true
    });

    const onSubmit = async (data: UserSubmitData) => {
        await createUser({ data });
        modals.close(createUserModalId);
    };

    const onCreate = () => {
        modals.open({
            modalId: createUserModalId,
            centered: true,
            title: T('page.users.newUser'),
            children: <UserForm onSubmit={onSubmit} />
        });
    };

    const onInvite = () => {
        modals.open({
            centered: true,
            title: T('user.invitationCode'),
            children: <Invitation />
        });
    };

    return (
        <ContentBox>
            <ContentBox.Title>{T('entity.users')}</ContentBox.Title>
            <ContentBox.Content>
                <Table stickyHeader>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>{T('common.name')}</Table.Th>
                            <Table.Th>{T('user.email')}</Table.Th>
                            <Table.Th>{T('user.admin')}</Table.Th>
                            <Table.Th>{T('status.enabled')}</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {userList.map(
                            ({ id, name, email, isAdmin, isEnabled }) => {
                                const itsYou = id === user.id;
                                return (
                                    <Table.Tr key={id}>
                                        <Table.Td>
                                            {name}
                                            {itsYou ? (
                                                <>
                                                    {' '}
                                                    <Chip
                                                        size="xs"
                                                        display="inline-block"
                                                    >
                                                        {T('common.itsYou')}
                                                    </Chip>
                                                </>
                                            ) : null}
                                        </Table.Td>
                                        <Table.Td>{email}</Table.Td>
                                        <Table.Td>
                                            {itsYou ? (
                                                <MdCheck size={25} />
                                            ) : (
                                                <Switch
                                                    checked={isAdmin}
                                                    onChange={(
                                                        e: React.ChangeEvent<HTMLInputElement>
                                                    ) =>
                                                        editUser({
                                                            userId: id,
                                                            data: {
                                                                isAdmin:
                                                                    e
                                                                        .currentTarget
                                                                        .checked
                                                            }
                                                        })
                                                    }
                                                />
                                            )}
                                        </Table.Td>
                                        <Table.Td>
                                            {itsYou ? (
                                                <MdCheck size={25} />
                                            ) : (
                                                <Switch
                                                    checked={isEnabled}
                                                    onChange={(
                                                        e: React.ChangeEvent<HTMLInputElement>
                                                    ) =>
                                                        editUser({
                                                            userId: id,
                                                            data: {
                                                                isEnabled:
                                                                    e
                                                                        .currentTarget
                                                                        .checked
                                                            }
                                                        })
                                                    }
                                                />
                                            )}
                                        </Table.Td>
                                    </Table.Tr>
                                );
                            }
                        )}
                    </Table.Tbody>
                </Table>
            </ContentBox.Content>
            <ContentBox.Footer>
                {configuration.registrationEnabled &&
                configuration.invitationEnabled ? (
                    <Button leftSection={<FaRegHandshake />} onClick={onInvite}>
                        {T('action.invite')}
                    </Button>
                ) : null}
                <Button leftSection={<HiPlus />} onClick={onCreate}>
                    {T('action.create')}
                </Button>
            </ContentBox.Footer>
        </ContentBox>
    );
};

export default Users;
