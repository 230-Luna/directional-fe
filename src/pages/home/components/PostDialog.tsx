import { useState, useEffect } from 'react'
import { Button } from '../../../components/Button'
import { Flex } from '../../../components/Flex'
import { Text } from '../../../components/Text'
import { Input } from '../../../components/Input'
import { SelectBox } from '../../../components/SelectBox'
import { Spacing } from '../../../components/Spacing'
import { colors } from '@/constants/colors'
import { css } from '@emotion/react'
import { Textarea } from '../../../components/TextArea'

export type Category = 'NOTICE' | 'QNA' | 'FREE'

interface PostDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: {
    title: string
    body: string
    tags: string[]
    category: Category
  }) => void
  defaultValues?: {
    title: string
    body: string
    tags: string
    category: Category
  }
  readOnly?: boolean
}

export function PostDialog({
  open,
  onClose,
  onSubmit,
  defaultValues,
  readOnly = false
}: PostDialogProps) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [tags, setTags] = useState('')
  const [category, setCategory] = useState<Category>('NOTICE')

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTitle(defaultValues?.title ?? '')
      setBody(defaultValues?.body ?? '')
      setTags(defaultValues?.tags ?? '')
      setCategory(defaultValues?.category ?? 'NOTICE')
    }
  }, [open, defaultValues])

  if (!open) return null

  const handleSubmit = () => {
    onSubmit({
      title,
      body,
      tags: tags
        .split(',')
        .map(tag => tag.trim())
        .filter(Boolean),
      category
    })
  }

  return (
    <div css={overlayStyle}>
      <div css={dialogStyle}>
        <Text typography="h5">{readOnly ? '포스트 조회' : '새 글 작성'}</Text>
        <Spacing size={24} />

        <Input
          label="제목"
          value={title}
          onChange={e => setTitle(e.target.value)}
          readOnly={readOnly}
        />
        <Spacing size={16} />
        <Flex
          gap={8}
          alignContent="center">
          <Text
            typography="body3"
            color={colors.textPrimary}>
            카테고리
          </Text>
          <SelectBox
            placeholder="카테고리 선택"
            value={category}
            options={[
              { value: 'NOTICE', label: 'NOTICE' },
              { value: 'QNA', label: 'QNA' },
              { value: 'FREE', label: 'FREE' }
            ]}
            onChange={value => setCategory(value as Category)}
            disabled={readOnly}
          />
        </Flex>
        <Spacing size={16} />

        <Textarea
          label="내용"
          value={body}
          onChange={e => setBody(e.target.value)}
          rows={6}
          readOnly={readOnly}
        />
        <Spacing size={16} />

        <Input
          label="태그 (콤마로 구분)"
          value={tags}
          onChange={e => setTags(e.target.value)}
          readOnly={readOnly}
        />
        <Spacing size={24} />

        <Flex
          gap={40}
          justify="center">
          <Button
            onClick={onClose}
            css={{ backgroundColor: colors.primary300 }}>
            취소
          </Button>
          {!readOnly && <Button onClick={handleSubmit}>등록</Button>}
        </Flex>
      </div>
    </div>
  )
}

const overlayStyle = css`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
`

const dialogStyle = css`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: ${colors.backgroundPrimary};
  padding: 24px;
  border-radius: 16px;
  width: 500px;
  max-width: 50vw;
`
